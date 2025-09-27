# Image Conversion Feature

## Overview

The AI Talking Portraits frontend now supports automatic image conversion to ensure compatibility with the backend model, which requires PNG format images.

## Supported Input Formats

- **JPEG/JPG** - Converted to PNG
- **PNG** - Used directly (resized if needed)
- **HEIC/HEIF** - iPhone photos, converted to PNG
- **WebP** - Converted to PNG

## Features

### Automatic Conversion
- All non-PNG images are automatically converted to PNG format
- Conversion happens client-side using HTML5 Canvas API
- HEIC files use the `heic2any` library for conversion

### Image Optimization
- Images are resized to maximum 2048x2048 pixels
- Aspect ratio is maintained during resize
- PNG compression quality set to 90%
- File size limit increased to 50MB for raw input files

### User Experience
- Real-time conversion progress indicator
- Success notification when conversion completes
- Visual indicator on converted images
- Error handling for unsupported formats or conversion failures

## Technical Implementation

### Frontend Components

1. **Image Converter (`/src/lib/imageConverter.js`)**
   - `convertToPng()` - Main conversion function
   - `validateImageForConversion()` - Validates input files
   - `getFileTypeName()` - User-friendly type names

2. **Updated CameraCapture Component**
   - Integrated conversion workflow
   - Progress indicators
   - Error handling

### Backend Changes

- Backend now only accepts PNG format (`image/png`)
- Updated validation messages
- Maintains 10MB limit for processed PNG files

## Usage

Users can now:
1. Upload iPhone HEIC photos directly
2. Upload JPEG photos from any camera
3. Upload WebP images
4. All formats are automatically converted to PNG

The conversion process is transparent to users and happens automatically when they select or drop an image file.

## Dependencies

- `heic2any@^0.0.4` - For HEIC/HEIF conversion
- HTML5 Canvas API - For JPEG/WebP conversion and resizing

## Error Handling

- Unsupported file types show clear error messages
- Conversion failures are caught and reported
- Large files (>50MB) are rejected before conversion
- Network errors during upload are handled gracefully

## Performance Considerations

- HEIC conversion can take 2-5 seconds for large files
- Canvas-based conversion is typically under 1 second
- Progress indicators keep users informed during conversion
- Converted files are cached in memory until upload