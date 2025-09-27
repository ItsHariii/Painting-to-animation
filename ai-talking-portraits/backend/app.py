from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import uuid
import os
import tempfile
import logging
from pathlib import Path
from PIL import Image
import io
from typing import Optional
import config
from services.s3_service import S3Service
from services.openai_service import OpenAIService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Talking Portraits API", version="1.0.0")

# Initialize S3 service
try:
    s3_service = S3Service()
    logger.info("S3 service initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize S3 service: {e}")
    s3_service = None

# Initialize OpenAI service
try:
    openai_service = OpenAIService()
    logger.info("OpenAI service initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize OpenAI service: {e}")
    openai_service = None

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def validate_image_file(file: UploadFile) -> bool:
    """Validate uploaded image file format and size"""
    if file.content_type not in config.SUPPORTED_IMAGE_FORMATS:
        return False
    
    if file.size and file.size > config.MAX_IMAGE_SIZE:
        return False
    
    return True

def create_job_directory(job_id: str) -> Path:
    """Create temporary directory structure for job processing"""
    job_dir = Path(tempfile.gettempdir()) / job_id
    job_dir.mkdir(exist_ok=True)
    logger.info(f"Created job directory: {job_dir}")
    return job_dir

@app.get("/")
async def root():
    return {"message": "AI Talking Portraits API"}

@app.get("/health")
async def health_check():
    """Health check endpoint that verifies all services"""
    health_status = {
        "status": "healthy",
        "services": {
            "api": "healthy",
            "s3": "healthy" if s3_service else "unavailable",
            "openai": "checking..."
        }
    }
    
    # Check OpenAI service health
    if openai_service:
        try:
            openai_health = openai_service.health_check()
            health_status["services"]["openai"] = openai_health["status"]
        except Exception as e:
            health_status["services"]["openai"] = "unhealthy"
            logger.error(f"OpenAI health check failed: {e}")
    else:
        health_status["services"]["openai"] = "unavailable"
    
    # Determine overall status
    if health_status["services"]["openai"] == "unhealthy":
        health_status["status"] = "degraded"
    elif health_status["services"]["openai"] == "unavailable":
        health_status["status"] = "degraded"
        
    return health_status

@app.post("/animate")
async def animate_portrait(
    image: UploadFile = File(..., description="Portrait image (JPG/PNG)"),
    context: Optional[str] = Form(None, description="Optional context for script generation"),
    motion_id: str = Form("wave_5s", description="Motion type (wave_5s, idle_5s, step_5s, lookaround_5s)"),
    target_secs: int = Form(5, description="Target video duration in seconds")
):
    """
    Create animated talking portrait from uploaded image
    
    - **image**: Portrait image file (JPG/PNG format, max 10MB)
    - **context**: Optional context for script generation
    - **motion_id**: Type of motion animation to apply
    - **target_secs**: Target duration for generated video
    """
    job_id = str(uuid.uuid4())
    logger.info(f"Starting animation job {job_id}")
    
    try:
        # Validate image file
        if not validate_image_file(image):
            logger.error(f"Invalid image file: {image.filename}, content_type: {image.content_type}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image file. Supported formats: JPG, PNG. Max size: {config.MAX_IMAGE_SIZE // (1024*1024)}MB"
            )
        
        # Validate motion_id
        if motion_id not in config.DRIVING_VIDEOS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid motion_id. Supported values: {list(config.DRIVING_VIDEOS.keys())}"
            )
        
        # Create local job directory for temporary processing
        job_dir = create_job_directory(job_id)
        
        # Save uploaded image
        image_content = await image.read()
        
        # Validate image can be opened with PIL
        try:
            pil_image = Image.open(io.BytesIO(image_content))
            pil_image.verify()  # Verify it's a valid image
        except Exception as e:
            logger.error(f"Invalid image format for job {job_id}: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail="Invalid or corrupted image file"
            )
        
        # Save raw image to local job directory
        local_image_path = job_dir / "portrait.jpg"
        with open(local_image_path, "wb") as f:
            f.write(image_content)
        
        logger.info(f"Saved image locally for job {job_id}: {local_image_path}")
        
        # Upload image to S3 if S3 service is available
        s3_image_key = None
        if s3_service:
            s3_image_key = s3_service.upload_job_file(
                job_id=job_id,
                file_type="input",
                local_file_path=str(local_image_path),
                filename="portrait.jpg"
            )
            if s3_image_key:
                logger.info(f"Successfully uploaded image to S3: {s3_image_key}")
            else:
                logger.warning(f"Failed to upload image to S3 for job {job_id}")
        else:
            logger.warning("S3 service not available, image stored locally only")
        
        # Log processing parameters
        logger.info(f"Job {job_id} parameters - context: {context}, motion_id: {motion_id}, target_secs: {target_secs}")
        
        # Check if OpenAI service is available
        if not openai_service:
            raise HTTPException(
                status_code=503,
                detail="OpenAI service is not available. Please check configuration."
            )
        
        # Step 1: Analyze image with OpenAI Vision (if context is minimal)
        image_analysis = None
        if not context or len(context.strip()) < 10:
            try:
                logger.info(f"Analyzing image with OpenAI Vision for job {job_id}")
                image_analysis = openai_service.analyze_image_with_vision(local_image_path, context)
                logger.info(f"Image analysis completed for job {job_id}")
            except Exception as e:
                logger.warning(f"Image analysis failed for job {job_id}: {e}")
                # Continue without image analysis
                image_analysis = None
        
        # Step 2: Generate script using OpenAI
        try:
            logger.info(f"Generating script for job {job_id}")
            script = openai_service.generate_script(
                context=context,
                target_seconds=target_secs,
                image_analysis=image_analysis
            )
            logger.info(f"Script generated successfully for job {job_id}")
            
            # Save script to job directory
            script_path = job_dir / "script.txt"
            with open(script_path, "w", encoding="utf-8") as f:
                f.write(script)
            
        except Exception as e:
            logger.error(f"Script generation failed for job {job_id}: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate script: {str(e)}"
            )
        
        # Step 3: Convert script to speech using OpenAI TTS
        try:
            logger.info(f"Converting script to speech for job {job_id}")
            audio_path = job_dir / "speech.wav"
            
            tts_success = openai_service.text_to_speech(
                text=script,
                output_path=audio_path,
                voice="alloy"  # Default voice, could be made configurable
            )
            
            if not tts_success:
                raise Exception("TTS conversion failed")
            
            logger.info(f"TTS conversion completed for job {job_id}")
            
        except Exception as e:
            logger.error(f"TTS conversion failed for job {job_id}: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to convert text to speech: {str(e)}"
            )
        
        # Upload generated files to S3 if available
        s3_script_key = None
        s3_audio_key = None
        
        if s3_service:
            try:
                # Upload script
                s3_script_key = s3_service.upload_job_file(
                    job_id=job_id,
                    file_type="script",
                    local_file_path=str(script_path),
                    filename="script.txt"
                )
                
                # Upload audio
                s3_audio_key = s3_service.upload_job_file(
                    job_id=job_id,
                    file_type="audio", 
                    local_file_path=str(audio_path),
                    filename="speech.wav"
                )
                
                logger.info(f"Generated files uploaded to S3 for job {job_id}")
                
            except Exception as e:
                logger.warning(f"Failed to upload generated files to S3 for job {job_id}: {e}")
        
        # TODO: Continue with animation pipeline in subsequent tasks
        # For now, return response with script and audio generation completed
        response_data = {
            "status": "script_and_audio_ready",
            "job_id": job_id,
            "script": script,
            "message": "Script generation and TTS conversion completed successfully. Animation pipeline will be implemented in subsequent tasks.",
            "parameters": {
                "context": context,
                "motion_id": motion_id,
                "target_secs": target_secs
            },
            "processing": {
                "image_analysis": image_analysis is not None,
                "script_generated": True,
                "audio_generated": True,
                "script_length": len(script),
                "estimated_duration": f"{(len(script.split()) / 150) * 60:.1f}s"
            },
            "storage": {
                "local_image": str(local_image_path),
                "local_script": str(script_path),
                "local_audio": str(audio_path),
                "s3_image_key": s3_image_key,
                "s3_script_key": s3_script_key,
                "s3_audio_key": s3_audio_key
            }
        }
        
        return JSONResponse(
            status_code=202,
            content=response_data
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error in job {job_id}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": "Internal server error occurred during processing",
                "job_id": job_id
            }
        )

@app.get("/status/{job_id}")
async def get_job_status(job_id: str):
    """
    Get status of animation job
    
    - **job_id**: Unique job identifier
    """
    try:
        job_dir = Path(tempfile.gettempdir()) / job_id
        
        if not job_dir.exists():
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )
        
        # TODO: Implement actual status checking in subsequent tasks
        # For now, return a placeholder response
        return {
            "status": "processing",
            "job_id": job_id,
            "message": "Status checking will be implemented in subsequent tasks"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking status for job {job_id}: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "error": "Error checking job status",
                "job_id": job_id
            }
        )

@app.get("/audio/{job_id}")
async def get_job_audio(job_id: str):
    """
    Get generated audio file for a job
    
    - **job_id**: Unique job identifier
    """
    try:
        job_dir = Path(tempfile.gettempdir()) / job_id
        audio_path = job_dir / "speech.wav"
        
        if not audio_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Audio file not found for this job"
            )
        
        from fastapi.responses import FileResponse
        return FileResponse(
            path=str(audio_path),
            media_type="audio/wav",
            filename=f"speech_{job_id}.wav"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error serving audio for job {job_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error serving audio file"
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)