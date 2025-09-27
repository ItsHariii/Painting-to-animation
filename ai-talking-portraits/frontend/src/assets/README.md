# Assets Directory

This directory contains static assets for the AI Talking Portraits application.

## Structure

```
assets/
├── images/          # Image assets (logos, backgrounds, sample portraits, etc.)
├── icons/           # Custom icons and graphics
└── README.md        # This file
```

## Usage

### Images
Place your image assets in the `images/` folder. Common use cases:
- Sample portrait images for demonstrations
- Background images or textures
- Logo variations
- Gallery placeholder images
- Tutorial/help images

### Importing Assets in React
```javascript
// Import images
import samplePortrait from '../assets/images/sample-portrait.jpg'
import logo from '../assets/images/logo.png'

// Use in components
<img src={samplePortrait} alt="Sample portrait" />
```

### Supported Formats
- **Images**: JPG, PNG, SVG, WebP
- **Icons**: SVG (preferred), PNG
- **Backgrounds**: JPG, PNG, WebP

## Best Practices

1. **Naming Convention**: Use kebab-case for file names
   - `sample-portrait-1.jpg`
   - `museum-background.png`
   - `app-logo.svg`

2. **Optimization**: 
   - Compress images before adding them
   - Use WebP format when possible for better performance
   - Keep file sizes reasonable for web usage

3. **Organization**: 
   - Group related images in subfolders if needed
   - Use descriptive names that indicate the image purpose

## Examples

```
images/
├── portraits/
│   ├── sample-da-vinci.jpg
│   ├── sample-shakespeare.jpg
│   └── sample-cleopatra.jpg
├── backgrounds/
│   ├── museum-texture.jpg
│   └── gallery-wall.png
├── logos/
│   ├── app-logo.svg
│   ├── app-logo-white.svg
│   └── favicon.png
└── ui/
    ├── upload-placeholder.svg
    └── video-thumbnail.jpg
```
