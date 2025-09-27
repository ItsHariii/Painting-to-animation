"""
Script generation service using OpenAI for contextual dialogue
"""

from typing import Dict, Any, Optional
import openai
from openai import OpenAI

class ScriptService:
    """Handles script generation and text-to-speech conversion"""
    
    def __init__(self, config):
        self.config = config
        self.client = OpenAI(api_key=config.openai_api_key)
        self.model = config.openai_model
        self.tts_model = config.openai_tts_model
        self.tts_voice = config.openai_tts_voice
    
    async def generate_museum_script(
        self, 
        context: str, 
        portrait_info: Optional[Dict[str, Any]] = None,
        duration: int = 20
    ) -> Dict[str, Any]:
        """
        Generate a contextual script for a museum portrait
        
        Args:
            context: Historical context or visitor question
            portrait_info: Information about the portrait (artist, subject, period)
            duration: Target duration in seconds
            
        Returns:
            Dictionary with generated script and metadata
        """
        try:
            # Build the prompt for museum context
            prompt = self._build_museum_prompt(context, portrait_info, duration)
            
            # Generate script using OpenAI
            response = await self._call_openai_chat(prompt)
            
            # Parse and validate the response
            script_data = self._parse_script_response(response, duration)
            
            return {
                "success": True,
                "script": script_data["text"],
                "segments": script_data["segments"],
                "estimated_duration": script_data["duration"],
                "character_info": script_data.get("character_info", {})
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "script": None
            }
    
    async def text_to_speech(
        self, 
        script_text: str, 
        output_path: str,
        voice: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Convert script text to speech audio
        
        Args:
            script_text: Text to convert to speech
            output_path: Path to save the audio file
            voice: Voice to use (defaults to config voice)
            
        Returns:
            Dictionary with TTS results
        """
        try:
            voice = voice or self.tts_voice
            
            # Generate speech using OpenAI TTS
            response = self.client.audio.speech.create(
                model=self.tts_model,
                voice=voice,
                input=script_text,
                response_format="wav"
            )
            
            # Save audio to file
            with open(output_path, "wb") as f:
                f.write(response.content)
            
            return {
                "success": True,
                "audio_path": output_path,
                "voice_used": voice,
                "text_length": len(script_text)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "audio_path": None
            }
    
    def _build_museum_prompt(
        self, 
        context: str, 
        portrait_info: Optional[Dict[str, Any]], 
        duration: int
    ) -> str:
        """
        Build a prompt for generating museum portrait dialogue
        
        Args:
            context: User-provided context or question
            portrait_info: Portrait metadata
            duration: Target duration
            
        Returns:
            Formatted prompt string
        """
        base_prompt = f"""
        You are bringing a historical portrait to life in a museum setting. 
        Generate a {duration}-second script where the portrait subject speaks directly to museum visitors.
        
        Context: {context}
        """
        
        if portrait_info:
            base_prompt += f"""
            
            Portrait Information:
            - Subject: {portrait_info.get('subject', 'Unknown')}
            - Artist: {portrait_info.get('artist', 'Unknown')}
            - Period: {portrait_info.get('period', 'Unknown')}
            - Historical Context: {portrait_info.get('historical_context', 'Unknown')}
            """
        
        base_prompt += f"""
        
        Requirements:
        - Speak in first person as the portrait subject
        - Keep the tone appropriate for a museum audience (educational but engaging)
        - Target approximately {duration} seconds of speech (roughly {duration * 3} words)
        - Include historical insights and personal perspective
        - Make it feel like a genuine conversation with visitors
        - End with an invitation for visitors to learn more
        
        Return the response as a JSON object with:
        - "text": the complete script
        - "segments": array of 3-4 shorter segments for animation variety
        - "character_info": brief background about the speaking character
        """
        
        return base_prompt
    
    async def _call_openai_chat(self, prompt: str) -> str:
        """
        Make a chat completion call to OpenAI
        
        Args:
            prompt: The prompt to send
            
        Returns:
            Response text from OpenAI
        """
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system", 
                    "content": "You are an expert museum curator and historical interpreter."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content
    
    def _parse_script_response(self, response: str, target_duration: int) -> Dict[str, Any]:
        """
        Parse and validate the OpenAI response
        
        Args:
            response: Raw response from OpenAI
            target_duration: Target duration for validation
            
        Returns:
            Parsed script data
        """
        try:
            import json
            data = json.loads(response)
            
            # Validate required fields
            if "text" not in data:
                raise ValueError("Response missing 'text' field")
            
            # Estimate duration (rough: 3 words per second)
            word_count = len(data["text"].split())
            estimated_duration = word_count / 3
            
            # Create segments if not provided
            if "segments" not in data:
                text = data["text"]
                segment_length = len(text) // 3
                data["segments"] = [
                    text[i:i+segment_length] 
                    for i in range(0, len(text), segment_length)
                ]
            
            data["duration"] = estimated_duration
            return data
            
        except json.JSONDecodeError:
            # Fallback: treat as plain text
            return {
                "text": response,
                "segments": [response],
                "duration": len(response.split()) / 3,
                "character_info": {}
            }