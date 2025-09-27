#!/usr/bin/env python3
"""
Test script for the new S3 storage structure
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.s3_service import S3Service
import config
import logging
import tempfile
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_new_s3_structure():
    """Test the new simplified S3 structure"""
    
    print("🧪 Testing New S3 Storage Structure")
    print("=" * 50)
    
    try:
        # Initialize S3 service
        s3_service = S3Service()
        print(f"✅ S3 service initialized for bucket: {s3_service.bucket_name}")
        
        # Test job ID
        test_job_id = "test-job-12345"
        
        # Test 1: Check driving videos path
        print(f"\n📹 Testing driving videos structure:")
        for motion_id, s3_path in config.DRIVING_VIDEOS.items():
            print(f"  - {motion_id}: {s3_path}")
            # Note: We won't test actual existence since videos might not be uploaded yet
        
        # Test 2: Test job file structure
        print(f"\n📁 Testing job structure for job: {test_job_id}")
        
        # Create a test image file
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as temp_file:
            temp_file.write(b"fake image data for testing")
            temp_image_path = temp_file.name
        
        try:
            # Test input upload
            print(f"  📤 Testing input upload...")
            s3_key = s3_service.upload_job_file(
                job_id=test_job_id,
                file_type="input",
                local_file_path=temp_image_path
            )
            
            if s3_key:
                expected_key = f"jobs/{test_job_id}/portrait.jpg"
                if s3_key == expected_key:
                    print(f"  ✅ Input upload successful: {s3_key}")
                else:
                    print(f"  ❌ Input upload path mismatch. Expected: {expected_key}, Got: {s3_key}")
            else:
                print(f"  ❌ Input upload failed")
            
            # Test job file listing
            print(f"  📋 Testing job file listing...")
            job_files = s3_service.list_job_files(test_job_id)
            print(f"  📄 Job files status: {job_files}")
            
            # Test URL generation
            print(f"  🔗 Testing URL generation...")
            input_url = s3_service.get_job_input_url(test_job_id)
            output_url = s3_service.get_job_output_url(test_job_id)
            
            if input_url:
                print(f"  ✅ Input URL generated: {input_url[:50]}...")
            else:
                print(f"  ❌ Input URL generation failed")
            
            if output_url:
                print(f"  ✅ Output URL generated: {output_url[:50]}...")
            else:
                print(f"  ⚠️  Output URL not available (expected - no output file yet)")
            
            # Test job existence check
            print(f"  🔍 Testing job existence check...")
            exists = s3_service.job_exists(test_job_id)
            print(f"  📂 Job exists: {exists}")
            
            # Cleanup test files
            print(f"  🧹 Cleaning up test files...")
            cleanup_success = s3_service.delete_job_files(test_job_id)
            print(f"  🗑️  Cleanup successful: {cleanup_success}")
            
        finally:
            # Clean up local temp file
            os.unlink(temp_image_path)
        
        print(f"\n✅ S3 structure test completed successfully!")
        print(f"\n📋 New Structure Summary:")
        print(f"  🎬 Driving videos: driving_videos/*.mp4")
        print(f"  📁 Job folders: jobs/{{job_id}}/")
        print(f"  📷 Input images: jobs/{{job_id}}/portrait.jpg")
        print(f"  🎥 Output videos: jobs/{{job_id}}/final.mp4")
        
    except Exception as e:
        print(f"❌ S3 structure test failed: {e}")
        logger.error(f"S3 test error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = test_new_s3_structure()
    sys.exit(0 if success else 1)