"""
S3 Service for handling file uploads and downloads
"""
import boto3
import logging
from botocore.exceptions import ClientError, NoCredentialsError
from pathlib import Path
from typing import Optional, Dict, Any
import config

logger = logging.getLogger(__name__)

class S3Service:
    def __init__(self):
        """Initialize S3 client with credentials from config"""
        try:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=config.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
                region_name=config.AWS_REGION
            )
            self.bucket_name = config.S3_BUCKET_NAME
            logger.info(f"S3 client initialized for bucket: {self.bucket_name}")
        except NoCredentialsError:
            logger.error("AWS credentials not found")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize S3 client: {e}")
            raise

    def upload_file(self, local_file_path: str, s3_key: str) -> bool:
        """
        Upload a file to S3
        
        Args:
            local_file_path: Path to local file
            s3_key: S3 object key (path in bucket)
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            self.s3_client.upload_file(local_file_path, self.bucket_name, s3_key)
            logger.info(f"Successfully uploaded {local_file_path} to s3://{self.bucket_name}/{s3_key}")
            return True
        except FileNotFoundError:
            logger.error(f"Local file not found: {local_file_path}")
            return False
        except ClientError as e:
            logger.error(f"Failed to upload file to S3: {e}")
            return False

    def download_file(self, s3_key: str, local_file_path: str) -> bool:
        """
        Download a file from S3
        
        Args:
            s3_key: S3 object key (path in bucket)
            local_file_path: Path where to save the file locally
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Ensure local directory exists
            Path(local_file_path).parent.mkdir(parents=True, exist_ok=True)
            
            self.s3_client.download_file(self.bucket_name, s3_key, local_file_path)
            logger.info(f"Successfully downloaded s3://{self.bucket_name}/{s3_key} to {local_file_path}")
            return True
        except ClientError as e:
            logger.error(f"Failed to download file from S3: {e}")
            return False

    def upload_job_file(self, job_id: str, file_type: str, local_file_path: str, filename: str) -> Optional[str]:
        """
        Upload a file to the job's directory structure in S3
        
        Args:
            job_id: Unique job identifier
            file_type: Type of file (input, script, audio, motion, clips, final)
            local_file_path: Path to local file
            filename: Name of file in S3
            
        Returns:
            str: S3 key if successful, None otherwise
        """
        if file_type not in config.JOB_STRUCTURE:
            logger.error(f"Invalid file type: {file_type}")
            return None
            
        s3_key = f"{config.S3_PATHS['jobs']}{job_id}/{config.JOB_STRUCTURE[file_type]}{filename}"
        
        if self.upload_file(local_file_path, s3_key):
            return s3_key
        return None

    def get_driving_video_url(self, motion_id: str) -> Optional[str]:
        """
        Get the S3 URL for a driving video
        
        Args:
            motion_id: Motion identifier (wave_5s, idle_5s, etc.)
            
        Returns:
            str: S3 URL if video exists, None otherwise
        """
        if motion_id not in config.DRIVING_VIDEOS:
            logger.error(f"Invalid motion_id: {motion_id}")
            return None
            
        s3_key = config.DRIVING_VIDEOS[motion_id]
        
        try:
            # Check if object exists
            self.s3_client.head_object(Bucket=self.bucket_name, Key=s3_key)
            
            # Generate presigned URL (valid for 1 hour)
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': s3_key},
                ExpiresIn=3600
            )
            return url
        except ClientError as e:
            logger.error(f"Driving video not found: {s3_key}, error: {e}")
            return None

    def generate_presigned_url(self, s3_key: str, expiration: int = 3600) -> Optional[str]:
        """
        Generate a presigned URL for an S3 object
        
        Args:
            s3_key: S3 object key
            expiration: URL expiration time in seconds (default 1 hour)
            
        Returns:
            str: Presigned URL if successful, None otherwise
        """
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': s3_key},
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            logger.error(f"Failed to generate presigned URL for {s3_key}: {e}")
            return None

    def list_job_files(self, job_id: str) -> Dict[str, list]:
        """
        List all files in a job's directory structure
        
        Args:
            job_id: Unique job identifier
            
        Returns:
            dict: Dictionary with file types as keys and lists of filenames as values
        """
        job_prefix = f"{config.S3_PATHS['jobs']}{job_id}/"
        files_by_type = {file_type: [] for file_type in config.JOB_STRUCTURE.keys()}
        
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=job_prefix
            )
            
            if 'Contents' in response:
                for obj in response['Contents']:
                    key = obj['Key']
                    # Extract file type and filename from key
                    relative_path = key[len(job_prefix):]
                    for file_type, type_prefix in config.JOB_STRUCTURE.items():
                        if relative_path.startswith(type_prefix):
                            filename = relative_path[len(type_prefix):]
                            if filename:  # Don't include directory entries
                                files_by_type[file_type].append(filename)
                            break
            
            return files_by_type
        except ClientError as e:
            logger.error(f"Failed to list job files for {job_id}: {e}")
            return files_by_type

    def delete_job_files(self, job_id: str) -> bool:
        """
        Delete all files for a job
        
        Args:
            job_id: Unique job identifier
            
        Returns:
            bool: True if successful, False otherwise
        """
        job_prefix = f"{config.S3_PATHS['jobs']}{job_id}/"
        
        try:
            # List all objects with the job prefix
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=job_prefix
            )
            
            if 'Contents' in response:
                # Delete all objects
                objects_to_delete = [{'Key': obj['Key']} for obj in response['Contents']]
                
                self.s3_client.delete_objects(
                    Bucket=self.bucket_name,
                    Delete={'Objects': objects_to_delete}
                )
                
                logger.info(f"Deleted {len(objects_to_delete)} files for job {job_id}")
            
            return True
        except ClientError as e:
            logger.error(f"Failed to delete job files for {job_id}: {e}")
            return False