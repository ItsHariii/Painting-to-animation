#!/usr/bin/env python3
"""
Simple test script to verify the /animate endpoint functionality
"""
import requests
import io
from PIL import Image
import tempfile
import os

def create_test_image():
    """Create a simple test image"""
    # Create a simple RGB image
    img = Image.new('RGB', (256, 256), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    return img_bytes

def test_animate_endpoint():
    """Test the /animate endpoint"""
    url = "http://localhost:8000/animate"
    
    # Create test image
    test_image = create_test_image()
    
    # Prepare form data
    files = {
        'image': ('test.jpg', test_image, 'image/jpeg')
    }
    data = {
        'context': 'Test portrait of a historical figure',
        'motion_id': 'wave_5s',
        'target_secs': 5
    }
    
    try:
        response = requests.post(url, files=files, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 202:
            print("✅ Endpoint working correctly!")
            return True
        else:
            print("❌ Unexpected status code")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure FastAPI is running on localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_invalid_file():
    """Test with invalid file format"""
    url = "http://localhost:8000/animate"
    
    # Create a text file instead of image
    files = {
        'image': ('test.txt', io.StringIO('not an image'), 'text/plain')
    }
    data = {
        'context': 'Test',
        'motion_id': 'wave_5s',
        'target_secs': 5
    }
    
    try:
        response = requests.post(url, files=files, data=data)
        print(f"Invalid file test - Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Invalid file handling working correctly!")
            return True
        else:
            print("❌ Should have returned 400 for invalid file")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing /animate endpoint...")
    print("\n1. Testing valid image upload:")
    test_animate_endpoint()
    
    print("\n2. Testing invalid file format:")
    test_invalid_file()
    
    print("\nNote: Start the FastAPI server with 'uvicorn app:app --reload' to run these tests")