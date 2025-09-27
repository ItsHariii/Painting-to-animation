#!/usr/bin/env python3
"""
Test script for the /animate endpoint
"""
import requests
import json
from PIL import Image, ImageDraw
import io
import tempfile
import os

def create_test_image():
    """Create a simple test portrait image"""
    # Create a simple portrait-like image
    img = Image.new('RGB', (256, 256), color='lightblue')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple face
    # Head (circle)
    draw.ellipse([50, 50, 200, 200], fill='peachpuff', outline='black')
    
    # Eyes
    draw.ellipse([80, 100, 100, 120], fill='white', outline='black')
    draw.ellipse([150, 100, 170, 120], fill='white', outline='black')
    draw.ellipse([85, 105, 95, 115], fill='black')
    draw.ellipse([155, 105, 165, 115], fill='black')
    
    # Nose
    draw.line([125, 130, 125, 150], fill='black', width=2)
    
    # Mouth
    draw.arc([110, 160, 140, 180], 0, 180, fill='black', width=2)
    
    return img

def test_animate_endpoint():
    """Test the /animate endpoint"""
    print("Testing /animate endpoint")
    print("=" * 40)
    
    # Create test image
    test_image = create_test_image()
    
    # Save to temporary file
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
        test_image.save(tmp_file.name, 'JPEG')
        image_path = tmp_file.name
    
    try:
        # Prepare the request
        url = "http://localhost:8000/animate"
        
        with open(image_path, 'rb') as img_file:
            files = {
                'image': ('test_portrait.jpg', img_file, 'image/jpeg')
            }
            data = {
                'context': 'A Renaissance nobleman with a gentle expression',
                'motion_id': 'wave_5s',
                'target_secs': 5
            }
            
            print("Sending request to /animate endpoint...")
            response = requests.post(url, files=files, data=data, timeout=60)
            
            print(f"Response status: {response.status_code}")
            
            if response.status_code == 200 or response.status_code == 202:
                result = response.json()
                print("✓ Request successful!")
                print(f"Status: {result.get('status')}")
                print(f"Job ID: {result.get('job_id')}")
                
                if 'script' in result:
                    print(f"Generated script: {result['script'][:100]}...")
                
                if 'processing' in result:
                    processing = result['processing']
                    print(f"Image analysis: {processing.get('image_analysis')}")
                    print(f"Script generated: {processing.get('script_generated')}")
                    print(f"Audio generated: {processing.get('audio_generated')}")
                    print(f"Estimated duration: {processing.get('estimated_duration')}")
                
                return True
            else:
                print(f"✗ Request failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
    except Exception as e:
        print(f"✗ Test failed: {e}")
        return False
    finally:
        # Clean up temporary file
        if os.path.exists(image_path):
            os.unlink(image_path)

if __name__ == "__main__":
    print("Testing OpenAI Integration in /animate endpoint")
    print("=" * 50)
    
    success = test_animate_endpoint()
    
    if success:
        print("\n🎉 Endpoint test completed successfully!")
    else:
        print("\n❌ Endpoint test failed!")