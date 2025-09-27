"""
OpenAI service for script generation and text-to-speech conversion
"""
import logging
import os
from pathlib import Path
from typing import Optional, Dict, Any
import openai
from openai import OpenAI
import config

logger = logging.getLogger(__name__)

class OpenAIService:
    """Service for OpenAI API interactions including script generation and TTS"""
    
    def __init__(self):
        """Initialize OpenAI client with API key from config"""
        if not config.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY not found in configuration")
        
        try:
            self.client = OpenAI(api_key=config.OPENAI_API_KEY)
            logger.info("OpenAI service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {e}")
            raise
    
    def generate_script(
        self, 
        context: Optional[str] = None, 
        target_seconds: int = 5,
        image_analysis: Optional[str] = None
    ) -> str:
        """
        Generate script content using OpenAI API
        
        Args:
            context: Optional user-provided context about the portrait
            target_seconds: Target duration for the script in seconds
            image_analysis: Optional analysis of the image content
            
        Returns:
            Generated script text
            
        Raises:
            Exception: If OpenAI API call fails
        """
        try:
            # Build the prompt based on available information
            prompt = self._build_script_prompt(context, target_seconds, image_analysis)
            
            logger.info(f"Generating script with OpenAI - target: {target_seconds}s")
            logger.debug(f"Script generation prompt: {prompt}")
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a museum curator creating engaging first-person narratives for historical portraits. Create educational, respectful content appropriate for all ages."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            script = response.choices[0].message.content.strip()
            
            # Validate script length (rough estimate: ~150 words per minute speaking)
            word_count = len(script.split())
            estimated_duration = (word_count / 150) * 60  # Convert to seconds
            
            logger.info(f"Generated script: {word_count} words, estimated {estimated_duration:.1f}s duration")
            
            if estimated_duration > target_seconds * 1.5:
                logger.warning(f"Generated script may be too long for target duration")
            
            return script
            
        except openai.RateLimitError as e:
            logger.error(f"OpenAI rate limit exceeded: {e}")
            raise Exception("OpenAI rate limit exceeded. Please try again later.")
        except openai.APIError as e:
            logger.error(f"OpenAI API error: {e}")
            raise Exception(f"OpenAI API error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in script generation: {e}")
            raise Exception(f"Failed to generate script: {str(e)}")
    
    def _build_script_prompt(
        self, 
        context: Optional[str], 
        target_seconds: int,
        image_analysis: Optional[str]
    ) -> str:
        """Build the prompt for script generation based on available information"""
        
        base_prompt = f"Write a {target_seconds}-second first-person script for a historical portrait coming to life in a museum. "
        base_prompt += "The script should be engaging, educational, and appropriate for all ages. "
        base_prompt += "Speak as if you are the person in the portrait, introducing yourself and sharing something interesting about your life or time period."
        
        if context:
            base_prompt += f"\n\nContext provided by curator: {context}"
        
        if image_analysis:
            base_prompt += f"\n\nImage analysis: {image_analysis}"
        
        if not context and not image_analysis:
            base_prompt += "\n\nSince no specific context is provided, create a generic but engaging introduction "
            base_prompt += "that could work for a historical portrait, mentioning the experience of being painted "
            base_prompt += "and what life was like in your era."
        
        base_prompt += f"\n\nKeep the script to approximately {target_seconds} seconds of speaking time "
        base_prompt += "(roughly 2-3 words per second). Make it conversational and warm."
        
        return base_prompt
    
    def text_to_speech(self, text: str, output_path: Path, voice: str = "alloy") -> bool:
        """
        Convert text to speech using OpenAI TTS
        
        Args:
            text: Text to convert to speech
            output_path: Path where to save the audio file
            voice: Voice to use (alloy, echo, fable, onyx, nova, shimmer)
            
        Returns:
            True if successful, False otherwise
            
        Raises:
            Exception: If TTS conversion fails
        """
        try:
            logger.info(f"Converting text to speech - voice: {voice}, output: {output_path}")
            logger.debug(f"TTS text: {text[:100]}...")
            
            # Validate voice option
            valid_voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
            if voice not in valid_voices:
                logger.warning(f"Invalid voice '{voice}', using 'alloy'")
                voice = "alloy"
            
            response = self.client.audio.speech.create(
                model="tts-1",
                voice=voice,
                input=text,
                response_format="wav"
            )
            
            # Ensure output directory exists
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Write audio data to file
            with open(output_path, "wb") as f:
                f.write(response.content)
            
            # Verify file was created and has content
            if output_path.exists() and output_path.stat().st_size > 0:
                logger.info(f"TTS audio saved successfully: {output_path} ({output_path.stat().st_size} bytes)")
                return True
            else:
                logger.error("TTS audio file was not created or is empty")
                return False
                
        except openai.RateLimitError as e:
            logger.error(f"OpenAI TTS rate limit exceeded: {e}")
            raise Exception("OpenAI TTS rate limit exceeded. Please try again later.")
        except openai.APIError as e:
            logger.error(f"OpenAI TTS API error: {e}")
            raise Exception(f"OpenAI TTS API error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in TTS conversion: {e}")
            raise Exception(f"Failed to convert text to speech: {str(e)}")
    
    def analyze_image_with_vision(self, image_path: Path, context: Optional[str] = None) -> str:
        """
        Analyze image using OpenAI Vision API to generate contextual information
        
        Args:
            image_path: Path to the image file
            context: Optional additional context from user
            
        Returns:
            Analysis of the image content
            
        Raises:
            Exception: If vision API call fails
        """
        try:
            import base64
            
            logger.info(f"Analyzing image with OpenAI Vision: {image_path}")
            
            # Read and encode image
            with open(image_path, "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')
            
            prompt = "Analyze this portrait image for a museum talking portrait system. "
            prompt += "Describe the person's appearance, clothing style, time period, setting, and any other "
            prompt += "visual elements that could help generate an appropriate first-person narrative. "
            prompt += "Focus on historical and cultural context that would be educational for museum visitors."
            
            if context:
                prompt += f"\n\nAdditional context: {context}"
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_data}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=300
            )
            
            analysis = response.choices[0].message.content.strip()
            logger.info("Image analysis completed successfully")
            logger.debug(f"Image analysis result: {analysis[:100]}...")
            
            return analysis
            
        except openai.RateLimitError as e:
            logger.error(f"OpenAI Vision rate limit exceeded: {e}")
            raise Exception("OpenAI Vision rate limit exceeded. Please try again later.")
        except openai.APIError as e:
            logger.error(f"OpenAI Vision API error: {e}")
            raise Exception(f"OpenAI Vision API error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in image analysis: {e}")
            raise Exception(f"Failed to analyze image: {str(e)}")
    
    def health_check(self) -> Dict[str, Any]:
        """
        Check if OpenAI service is working properly
        
        Returns:
            Dictionary with health check results
        """
        try:
            # Simple test call to verify API key and connectivity
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=5
            )
            
            return {
                "status": "healthy",
                "api_accessible": True,
                "model": "gpt-4o-mini",
                "message": "OpenAI service is working properly"
            }
            
        except Exception as e:
            logger.error(f"OpenAI health check failed: {e}")
            return {
                "status": "unhealthy", 
                "api_accessible": False,
                "error": str(e),
                "message": "OpenAI service is not accessible"
            }