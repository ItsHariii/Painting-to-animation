#!/usr/bin/env python3
"""
Test script to verify S3 connection and bucket access
"""
import sys
import os
sys.path.append('.')

import config
from services.s3_service import S3Service
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_s3_connection():
    """Test S3 connection and basic operations"""
    try:
        # Initialize S3 service
        s3_service = S3Service()
        logger.info("✅ S3 service initialized successfully")
        
        # Test bucket access by listing driving videos
        logger.info(f"Testing access to bucket: {config.S3_BUCKET_NAME}")
        
        # Check if driving videos exist
        for motion_id, s3_key in config.DRIVING_VIDEOS.items():
            try:
                s3_service.s3_client.head_object(Bucket=config.S3_BUCKET_NAME, Key=s3_key)
                logger.info(f"✅ Found driving video: {motion_id} -> {s3_key}")
            except Exception as e:
                logger.warning(f"❌ Driving video not found: {motion_id} -> {s3_key}, error: {e}")
        
        # Test generating presigned URL for a driving video
        test_motion = "wave_5s"
        if test_motion in config.DRIVING_VIDEOS:
            url = s3_service.get_driving_video_url(test_motion)
            if url:
                logger.info(f"✅ Generated presigned URL for {test_motion}")
                logger.info(f"URL: {url[:100]}...")
            else:
                logger.warning(f"❌ Failed to generate presigned URL for {test_motion}")
        
        logger.info("✅ S3 connection test completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ S3 connection test failed: {e}")
        return False

def test_config():
    """Test configuration values"""
    logger.info("Testing configuration...")
    
    required_vars = [
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY', 
        'AWS_REGION',
        'S3_BUCKET_NAME',
        'OPENAI_API_KEY'
    ]
    
    for var in required_vars:
        value = getattr(config, var, None)
        if value:
            # Mask sensitive values
            if 'KEY' in var or 'SECRET' in var:
                masked_value = value[:8] + "..." + value[-4:] if len(value) > 12 else "***"
                logger.info(f"✅ {var}: {masked_value}")
            else:
                logger.info(f"✅ {var}: {value}")
        else:
            logger.error(f"❌ {var}: Not set")
    
    logger.info(f"✅ Available driving videos: {list(config.DRIVING_VIDEOS.keys())}")
    logger.info(f"✅ Supported image formats: {config.SUPPORTED_IMAGE_FORMATS}")
    logger.info(f"✅ Max image size: {config.MAX_IMAGE_SIZE // (1024*1024)}MB")

if __name__ == "__main__":
    print("=== AI Talking Portraits Configuration Test ===\n")
    
    test_config()
    print("\n" + "="*50 + "\n")
    
    test_s3_connection()
    
    print("\n=== Test Complete ===")