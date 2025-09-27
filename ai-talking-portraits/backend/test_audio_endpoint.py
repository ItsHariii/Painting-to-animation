#!/usr/bin/env python3
"""
Test the audio endpoint by creating a sample audio file
"""
import requests
import json
from PIL import Image, ImageDraw
import io
import tempfile
import os

def create_test_image():
    """Create a simple test portrait image"""
    img = Image.new('RGB', (256, 256), color='lightblue')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple face
    draw.ellipse([50, 50, 200, 200], fill='peachpuff', outline='black')
    draw.ellipse([80, 100, 100, 120], fill='white', outline='black')
    draw.ellipse([150, 100, 170, 120], fill='white', outline='black')
    draw.ellipse([85, 105, 95, 115], fill='black')
    draw.ellipse([155, 105, 165, 115], fill='black')
    draw.line([125, 130, 125, 150], fill='black', width=2)
    draw.arc([110, 160, 140, 180], 0, 180, fill='black', width=2)
    
    return img

def test_full_workflow():
    """Test the complete workflow including audio endpoint"""
    print("Testing complete workflow with audio endpoint")
    print("=" * 50)
    
    # Create test image
    test_image = create_test_image()
    
    # Save to temporary file
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
        test_image.save(tmp_file.name, 'JPEG')
        image_path = tmp_file.name
    
    try:
        # Step 1: Generate script and audio
        print("1. Generating script and audio...")
        url = "http://localhost:8000/animate"
        
        with open(image_path, 'rb') as img_file:
            files = {
                'image': ('test_portrait.jpg', img_file, 'image/jpeg')
            }
            data = {
                'context': 'A friendly historical figure',
                'motion_id': 'wave_5s',
                'target_secs': 5
            }
            
            response = requests.post(url, files=files, data=data, timeout=60)
            
            if response.status_code in [200, 202]:
                result = response.json()
                job_id = result.get('job_id')
                print(f"✓ Animation request successful! Job ID: {job_id}")
                
                if result.get('processing', {}).get('audio_generated'):
                    print("✓ Audio was generated")
                    
                    # Step 2: Test audio endpoint
                    print(f"2. Testing audio endpoint for job {job_id}...")
                    audio_url = f"http://localhost:8000/audio/{job_id}"
                    audio_response = requests.get(audio_url)
                    
                    if audio_response.status_code == 200:
                        print(f"✓ Audio endpoint working! Content-Type: {audio_response.headers.get('content-type')}")
                        print(f"✓ Audio file size: {len(audio_response.content)} bytes")
                        
                        # Save audio to test file
                        with open(f"test_audio_{job_id}.wav", "wb") as f:
                            f.write(audio_response.content)
                        print(f"✓ Audio saved as test_audio_{job_id}.wav")
                        
                        return True
                    else:
                        print(f"✗ Audio endpoint failed: {audio_response.status_code}")
                        print(f"Response: {audio_response.text}")
                        return False
                else:
                    print("✗ Audio was not generated")
                    return False
            else:
                print(f"✗ Animation request failed: {response.status_code}")
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
    success = test_full_workflow()
    
    if success:
        print("\n🎉 Full workflow test completed successfully!")
        print("The audio endpoint is working and you should be able to play audio in the frontend!")
    else:
        print("\n❌ Workflow test failed!")