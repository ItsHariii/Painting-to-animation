"""
Animation service for processing portrait images with FOMM and Wav2Lip
"""

import os
import subprocess
from typing import Optional, Dict, Any
from pathlib import Path

class AnimationService:
    """Handles the core animation pipeline using FOMM and Wav2Lip"""
    
    def __init__(self, config):
        self.config = config
        self.fomm_config = config.fomm_config_path
        self.fomm_checkpoint = config.fomm_checkpoint_path
        self.wav2lip_checkpoint = config.wav2lip_checkpoint_path
        self.driving_dir = config.driving_videos_dir
    
    async def animate_portrait(
        self, 
        source_image_path: str,
        audio_path: str,
        motion_style: str = "gentle",
        job_id: str = None
    ) -> Dict[str, Any]:
        """
        Main animation pipeline
        
        Args:
            source_image_path: Path to the portrait image
            audio_path: Path to the generated speech audio
            motion_style: Style of motion to apply
            job_id: Unique job identifier for temp files
            
        Returns:
            Dictionary with animation results and file paths
        """
        try:
            # Create job-specific temp directory
            job_dir = Path(self.config.temp_dir) / job_id
            job_dir.mkdir(parents=True, exist_ok=True)
            
            # Step 1: Apply motion using FOMM
            motion_video_path = await self._apply_motion(
                source_image_path, motion_style, job_dir
            )
            
            # Step 2: Apply lip sync using Wav2Lip
            final_video_path = await self._apply_lip_sync(
                motion_video_path, audio_path, job_dir
            )
            
            return {
                "success": True,
                "motion_video": motion_video_path,
                "final_video": final_video_path,
                "job_dir": str(job_dir)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "job_dir": str(job_dir) if 'job_dir' in locals() else None
            }
    
    async def _apply_motion(
        self, 
        source_image: str, 
        motion_style: str, 
        job_dir: Path
    ) -> str:
        """
        Apply motion to portrait using FOMM
        
        Args:
            source_image: Path to source portrait
            motion_style: Motion style identifier
            job_dir: Job-specific temporary directory
            
        Returns:
            Path to motion video file
        """
        # Select driving video based on motion style
        driving_video = self._get_driving_video(motion_style)
        motion_output = job_dir / "motion.mp4"
        
        # FOMM command
        cmd = [
            "python", "fomm/demo.py",
            "--config", self.fomm_config,
            "--checkpoint", self.fomm_checkpoint,
            "--source_image", source_image,
            "--driving_video", driving_video,
            "--result_video", str(motion_output),
            "--relative", "--adapt_scale"
        ]
        
        # TODO: Execute FOMM command
        # subprocess.run(cmd, check=True)
        
        return str(motion_output)
    
    async def _apply_lip_sync(
        self, 
        motion_video: str, 
        audio_path: str, 
        job_dir: Path
    ) -> str:
        """
        Apply lip synchronization using Wav2Lip
        
        Args:
            motion_video: Path to motion video from FOMM
            audio_path: Path to speech audio
            job_dir: Job-specific temporary directory
            
        Returns:
            Path to final lip-synced video
        """
        final_output = job_dir / "final.mp4"
        
        # Wav2Lip command
        cmd = [
            "python", "wav2lip/inference.py",
            "--checkpoint", self.wav2lip_checkpoint,
            "--face", motion_video,
            "--audio", audio_path,
            "--outfile", str(final_output),
            "--face_det_batch_size", "4",
            "--wav2lip_batch_size", "128",
            "--resize_factor", "1",
            "--pads", "0", "10", "0", "0"
        ]
        
        # TODO: Execute Wav2Lip command
        # subprocess.run(cmd, check=True)
        
        return str(final_output)
    
    def _get_driving_video(self, motion_style: str) -> str:
        """
        Get the appropriate driving video for the motion style
        
        Args:
            motion_style: Style identifier
            
        Returns:
            Path to driving video file
        """
        motion_files = {
            "gentle": "gentle_breathing.mp4",
            "expressive": "expressive_gestures.mp4",
            "formal": "formal_pose.mp4"
        }
        
        filename = motion_files.get(motion_style, "gentle_breathing.mp4")
        return os.path.join(self.driving_dir, filename)
    
    def cleanup_job_files(self, job_dir: str) -> None:
        """
        Clean up temporary files for a completed job
        
        Args:
            job_dir: Path to job directory to clean up
        """
        try:
            import shutil
            if os.path.exists(job_dir):
                shutil.rmtree(job_dir)
        except Exception as e:
            print(f"Warning: Could not clean up job directory {job_dir}: {e}")