"""
Storage service for handling file uploads and AWS S3 integration
"""

import os
import boto3
from botocore.exceptions import ClientError
from typing import Optional, Dict, Any
from pathlib import Path
import uuid

class StorageService:
    """Handles file storage operations and S3 integration"""
    
    def __init__(self, config):
        self.config = config
        self.s3_client = None
        self.bucket_name = config.s3_bucket_name
        
        # Initialize S3 client if credentials are provided
        if config.aws_access_key_id and config.aws_secret_access_key:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=config.aws_access_key_id,
                aws_secret_access_key=config.aws_secret_access_key,
                region_name=config.aws_region
            )
    
    async def save_uploaded_image(
        self, 
        image_data: bytes, 
        filename: str,
        job_id: str
    ) -> Dict[str, Any]:
        """
        Save uploaded portrait image locally and optionally to S3
        
        Args:
            image_data: Raw image bytes
            filename: Original filename
            job_id: Unique job identifier
            
        Returns:
            Dictionary with file paths and metadata
        """
        try:
            # Create job directory
            job_dir = Path(self.config.temp_dir) / job_id
            job_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate safe filename
            file_extension = Path(filename).suffix.lower()
            safe_filename = f"portrait{file_extension}"
            local_path = job_dir / safe_filename
            
            # Save locally
            with open(local_path, "wb") as f:
                f.write(image_data)
            
            result = {
                "success": True,
                "local_path": str(local_path),
                "filename": safe_filename,
                "size": len(image_data)
            }
            
            # Upload to S3 if configured
            if self.s3_client and self.bucket_name:
                s3_key = f"jobs/{job_id}/portrait.jpg"
                s3_url = await self._upload_to_s3(local_path, s3_key)
                result["s3_url"] = s3_url
                result["s3_key"] = s3_key
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "local_path": None
            }
    
    async def save_generated_video(
        self, 
        video_path: str, 
        job_id: str
    ) -> Dict[str, Any]:
        """
        Save generated video to S3 and create presigned URL
        
        Args:
            video_path: Local path to generated video
            job_id: Unique job identifier
            
        Returns:
            Dictionary with S3 URL and metadata
        """
        try:
            if not self.s3_client or not self.bucket_name:
                return {
                    "success": False,
                    "error": "S3 not configured",
                    "local_path": video_path
                }
            
            # Upload to S3
            s3_key = f"jobs/{job_id}/final.mp4"
            s3_url = await self._upload_to_s3(video_path, s3_key)
            
            # Generate presigned URL for download
            presigned_url = self._generate_presigned_url(s3_key, expiration=3600)
            
            return {
                "success": True,
                "s3_url": s3_url,
                "presigned_url": presigned_url,
                "s3_key": s3_key,
                "local_path": video_path
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "local_path": video_path
            }
    
    async def _upload_to_s3(self, local_path: str, s3_key: str) -> str:
        """
        Upload file to S3
        
        Args:
            local_path: Local file path
            s3_key: S3 object key
            
        Returns:
            S3 URL of uploaded file
        """
        try:
            self.s3_client.upload_file(local_path, self.bucket_name, s3_key)
            return f"s3://{self.bucket_name}/{s3_key}"
        except ClientError as e:
            raise Exception(f"S3 upload failed: {e}")
    
    def _generate_presigned_url(
        self, 
        s3_key: str, 
        expiration: int = 3600
    ) -> str:
        """
        Generate presigned URL for S3 object
        
        Args:
            s3_key: S3 object key
            expiration: URL expiration time in seconds
            
        Returns:
            Presigned URL string
        """
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': s3_key},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            raise Exception(f"Presigned URL generation failed: {e}")
    
    def validate_image_file(self, filename: str, file_size: int) -> Dict[str, Any]:
        """
        Validate uploaded image file
        
        Args:
            filename: Original filename
            file_size: File size in bytes
            
        Returns:
            Validation result dictionary
        """
        # Check file size
        if file_size > self.config.max_file_size:
            return {
                "valid": False,
                "error": f"File size {file_size} exceeds maximum {self.config.max_file_size}"
            }
        
        # Check file extension
        file_extension = Path(filename).suffix.lower()
        allowed_extensions = ['.jpg', '.jpeg', '.png']
        
        if file_extension not in allowed_extensions:
            return {
                "valid": False,
                "error": f"File type {file_extension} not allowed. Use: {allowed_extensions}"
            }
        
        return {"valid": True, "error": None}
    
    def cleanup_job_files(self, job_id: str) -> None:
        """
        Clean up local files for a job
        
        Args:
            job_id: Job identifier
        """
        try:
            import shutil
            job_dir = Path(self.config.temp_dir) / job_id
            if job_dir.exists():
                shutil.rmtree(job_dir)
        except Exception as e:
            print(f"Warning: Could not clean up job files for {job_id}: {e}")