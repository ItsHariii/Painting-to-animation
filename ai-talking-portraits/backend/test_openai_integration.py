#!/usr/bin/env python3
"""
Test script for OpenAI integration
"""
import sys
import os
import tempfile
from pathlib import Path

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.openai_service import OpenAIService
import config

def test_openai_service():
    """Test OpenAI service functionality"""
    print("Testing OpenAI Service Integration")
    print("=" * 50)
    
    try:
        # Initialize service
        print("1. Initializing OpenAI service...")
        service = OpenAIService()
        print("✓ OpenAI service initialized successfully")
        
        # Test health check
        print("\n2. Testing health check...")
        health = service.health_check()
        print(f"✓ Health check: {health['status']}")
        
        # Test script generation with minimal context
        print("\n3. Testing script generation (minimal context)...")
        script1 = service.generate_script(
            context="A Renaissance nobleman",
            target_seconds=5
        )
        print(f"✓ Script generated ({len(script1)} characters)")
        print(f"Script preview: {script1[:100]}...")
        
        # Test script generation without context
        print("\n4. Testing script generation (no context)...")
        script2 = service.generate_script(target_seconds=5)
        print(f"✓ Script generated ({len(script2)} characters)")
        print(f"Script preview: {script2[:100]}...")
        
        # Test TTS conversion
        print("\n5. Testing text-to-speech conversion...")
        with tempfile.TemporaryDirectory() as temp_dir:
            audio_path = Path(temp_dir) / "test_speech.wav"
            
            success = service.text_to_speech(
                text="Hello, I am a test of the text-to-speech system.",
                output_path=audio_path,
                voice="alloy"
            )
            
            if success and audio_path.exists():
                file_size = audio_path.stat().st_size
                print(f"✓ TTS conversion successful ({file_size} bytes)")
            else:
                print("✗ TTS conversion failed")
                return False
        
        print("\n" + "=" * 50)
        print("✓ All OpenAI integration tests passed!")
        return True
        
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        return False

def test_different_contexts():
    """Test script generation with various context inputs"""
    print("\nTesting various context inputs:")
    print("-" * 30)
    
    service = OpenAIService()
    
    test_contexts = [
        ("Napoleon Bonaparte, French Emperor", 6),
        ("A Victorian lady in formal dress", 5),
        ("Medieval knight in armor", 7),
        ("", 5),  # No context
        ("Ancient Egyptian pharaoh with golden headdress", 8)
    ]
    
    for context, duration in test_contexts:
        try:
            print(f"\nContext: '{context}' ({duration}s)")
            script = service.generate_script(context=context, target_seconds=duration)
            word_count = len(script.split())
            print(f"Generated: {word_count} words")
            print(f"Preview: {script[:80]}...")
        except Exception as e:
            print(f"Failed: {e}")

if __name__ == "__main__":
    print("OpenAI Integration Test")
    print("=" * 50)
    
    # Check if API key is configured
    if not config.OPENAI_API_KEY:
        print("✗ OPENAI_API_KEY not found in configuration")
        print("Please check your .env file")
        sys.exit(1)
    
    # Run basic tests
    if test_openai_service():
        # Run additional context tests
        test_different_contexts()
        print("\n🎉 All tests completed successfully!")
    else:
        print("\n❌ Tests failed!")
        sys.exit(1)