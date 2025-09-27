# S3 Storage Structure Update

## Overview

Updated the S3 bucket structure to a simplified format as requested:

```
hackgt12-animation-bucket/
├── driving_videos/              # Templates (backup)
│   └── *.mp4
└── jobs/                        # Everything else
    └── {job_id}/
        ├── portrait.jpg         # Input
        └── final.mp4            # Output
```

## Changes Made

### 1. Backend Configuration (`config.py`)

**Before:**
```python
S3_PATHS = {
    "driving": "driving/body/",
    "jobs": "jobs/",
    "temp": "temp/"
}

JOB_STRUCTURE = {
    "input": "input/",
    "script": "script/",
    "audio": "audio/",
    "motion": "motion/",
    "clips": "clips/",
    "final": "final/"
}

DRIVING_VIDEOS = {
    "wave_5s": "driving/body/wave_5s_256.mp4",
    # ...
}
```

**After:**
```python
S3_PATHS = {
    "driving_videos": "driving_videos/",
    "jobs": "jobs/"
}

JOB_FILES = {
    "input": "portrait.jpg",
    "output": "final.mp4"
}

DRIVING_VIDEOS = {
    "wave_5s": "driving_videos/wave_5s_256.mp4",
    # ...
}
```

### 2. S3 Service (`services/s3_service.py`)

**Updated Methods:**
- `upload_job_file()` - Simplified to use fixed filenames
- `list_job_files()` - Returns boolean existence instead of file lists
- Added `get_job_input_url()` - Get presigned URL for portrait.jpg
- Added `get_job_output_url()` - Get presigned URL for final.mp4
- Added `job_exists()` - Check if job directory exists

**Removed Complexity:**
- No more nested directory structure within jobs
- No more dynamic filename handling
- Simplified file type validation

### 3. Storage Service (`services/storage_service.py`)

**Updated Paths:**
- Input images: `uploads/{job_id}/{filename}` → `jobs/{job_id}/portrait.jpg`
- Output videos: `results/{job_id}/final.mp4` → `jobs/{job_id}/final.mp4`

### 4. Main Application (`app.py`)

**New Features:**
- Added `/video/{job_id}` endpoint for serving videos
- Updated `/status/{job_id}` to return proper URLs
- Simplified upload logic to use fixed filenames

**Updated Method Calls:**
- `upload_job_file()` now takes only 3 parameters instead of 4
- Status endpoint returns S3 URLs when available

### 5. Test Script

Created `test_new_s3_structure.py` to verify:
- S3 service initialization
- File upload with new structure
- URL generation
- Job existence checking
- Cleanup operations

## API Changes

### Status Endpoint Response

**Before:**
```json
{
  "status": "processing",
  "job_id": "12345",
  "message": "Status checking will be implemented..."
}
```

**After:**
```json
{
  "job_id": "12345",
  "status": "completed",
  "input_image_url": "https://s3.amazonaws.com/bucket/jobs/12345/portrait.jpg?...",
  "video_url": "https://s3.amazonaws.com/bucket/jobs/12345/final.mp4?...",
  "message": "Animation completed successfully"
}
```

### New Video Endpoint

```
GET /video/{job_id}
```
- Returns presigned S3 URL redirect if available
- Falls back to local file serving
- Proper error handling for missing files

## Benefits of New Structure

### 1. **Simplified Organization**
- Only 2 files per job instead of 6+ directories
- Clear, predictable file paths
- Easier to understand and maintain

### 2. **Better Performance**
- Fewer S3 API calls for file operations
- Direct file access without directory traversal
- Simplified cleanup operations

### 3. **Cost Optimization**
- Reduced S3 storage overhead
- Fewer objects to manage
- Simplified backup/restore operations

### 4. **Easier Debugging**
- Clear file structure for troubleshooting
- Predictable paths for manual inspection
- Simplified logging and monitoring

## Migration Notes

### For Existing Jobs
- Old structure jobs will still work with fallback logic
- New jobs will use the simplified structure
- Consider running a migration script if needed

### For Frontend
- No changes required - frontend already expects `video_url`
- Status polling will now receive proper S3 URLs
- Video playback will use presigned URLs for security

## Testing

Run the test script to verify the new structure:

```bash
cd ai-talking-portraits/backend
python test_new_s3_structure.py
```

This will test:
- S3 service initialization
- File upload/download operations
- URL generation
- Job management functions

## Security Considerations

- Presigned URLs expire after 1 hour by default
- Input images and output videos are private by default
- Access controlled through presigned URLs only
- No public bucket access required

## Next Steps

1. **Deploy Updated Code**
   - Update backend with new S3 structure
   - Test with real S3 bucket

2. **Upload Driving Videos**
   - Move existing videos to `driving_videos/` folder
   - Update any hardcoded paths

3. **Monitor Performance**
   - Check S3 costs with new structure
   - Monitor API response times
   - Verify presigned URL functionality

4. **Optional Migration**
   - Create script to migrate existing jobs if needed
   - Update any external references to old paths