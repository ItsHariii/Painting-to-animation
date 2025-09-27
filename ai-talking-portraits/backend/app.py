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

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Talking Portraits API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supported image formats
SUPPORTED_FORMATS = {"image/jpeg", "image/jpg", "image/png"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_image_file(file: UploadFile) -> bool:
    """Validate uploaded image file format and size"""
    if file.content_type not in SUPPORTED_FORMATS:
        return False
    
    if file.size and file.size > MAX_FILE_SIZE:
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
    return {"status": "healthy"}

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
                detail=f"Invalid image file. Supported formats: JPG, PNG. Max size: {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Create job directory
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
        
        # Save raw image to job directory
        image_path = job_dir / "source_raw.jpg"
        with open(image_path, "wb") as f:
            f.write(image_content)
        
        logger.info(f"Saved image for job {job_id}: {image_path}")
        
        # Log processing parameters
        logger.info(f"Job {job_id} parameters - context: {context}, motion_id: {motion_id}, target_secs: {target_secs}")
        
        # TODO: Implement actual processing pipeline in subsequent tasks
        # For now, return a placeholder response indicating the endpoint is working
        return JSONResponse(
            status_code=202,
            content={
                "status": "processing",
                "job_id": job_id,
                "message": "Image uploaded successfully. Processing pipeline will be implemented in subsequent tasks.",
                "parameters": {
                    "context": context,
                    "motion_id": motion_id,
                    "target_secs": target_secs
                }
            }
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)