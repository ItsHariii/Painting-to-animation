import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# AWS Configuration  
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-2")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

# Application Configuration
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

# S3 Bucket Structure Configuration
S3_PATHS = {
    "driving": "driving/body/",
    "jobs": "jobs/",
    "temp": "temp/"
}

# S3 Job Directory Structure
JOB_STRUCTURE = {
    "input": "input/",
    "script": "script/",
    "audio": "audio/",
    "motion": "motion/",
    "clips": "clips/",
    "final": "final/"
}

# Available driving videos in S3
DRIVING_VIDEOS = {
    "wave_5s": "driving/body/wave_5s_256.mp4",
    "idle_5s": "driving/body/idle_5s_256.mp4", 
    "step_5s": "driving/body/step_5s_256.mp4",
    "lookaround_5s": "driving/body/lookaround_5s_256.mp4"
}

# Model Paths
FOMM_CONFIG = "configs/taichi-256.yaml"
FOMM_CHECKPOINT = "models/fomm/taichi.pth"
WAV2LIP_CHECKPOINT = "models/wav2lip/wav2lip_gan.pth"
DRIVING_DIR = "backend/driving/body"

# File size limits
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
SUPPORTED_IMAGE_FORMATS = {"image/jpeg", "image/jpg", "image/png"}

# Processing timeouts (in seconds)
TIMEOUTS = {
    "image_analysis": 30,
    "script_generation": 60,
    "tts_generation": 120,
    "animation": 300,
    "total_job": 600
}