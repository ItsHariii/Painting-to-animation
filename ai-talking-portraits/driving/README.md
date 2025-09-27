# Driving Videos Directory

This directory contains motion template videos used to animate static portraits. These videos provide the movement patterns that FOMM applies to the source images.

## Directory Structure

```
driving/
├── portraits/
│   ├── gentle_breathing.mp4      # Subtle breathing and minimal movement
│   ├── expressive_gestures.mp4   # More animated hand and head movements
│   ├── formal_pose.mp4           # Dignified, minimal movement
│   ├── storytelling.mp4          # Narrative gestures and expressions
│   └── contemplative.mp4         # Thoughtful, reflective movements
├── segments/                     # Shorter clips for multi-part animations
│   ├── intro_5s.mp4
│   ├── main_10s.mp4
│   └── outro_5s.mp4
└── README.md
```

## Motion Styles

### Gentle Breathing (`gentle_breathing.mp4`)
- **Duration**: 5-8 seconds
- **Movement**: Subtle chest movement, slight head sway
- **Use Case**: Classical portraits, formal subjects
- **Characteristics**: Minimal but lifelike motion

### Expressive Gestures (`expressive_gestures.mp4`)
- **Duration**: 8-10 seconds
- **Movement**: Hand gestures, head turns, facial expressions
- **Use Case**: Artists, speakers, dynamic personalities
- **Characteristics**: More animated and engaging

### Formal Pose (`formal_pose.mp4`)
- **Duration**: 6-8 seconds
- **Movement**: Very subtle breathing, minimal head movement
- **Use Case**: Royal portraits, official figures, dignified subjects
- **Characteristics**: Maintains dignity and formality

### Storytelling (`storytelling.mp4`)
- **Duration**: 10-12 seconds
- **Movement**: Narrative hand gestures, expressive face
- **Use Case**: Historical figures, educators, narrators
- **Characteristics**: Engaging and educational

### Contemplative (`contemplative.mp4`)
- **Duration**: 8-10 seconds
- **Movement**: Thoughtful expressions, gentle head movements
- **Use Case**: Philosophers, scientists, introspective subjects
- **Characteristics**: Reflective and intellectual

## Technical Specifications

### Video Requirements
- **Resolution**: 512x512 pixels (square format)
- **Frame Rate**: 25 FPS
- **Duration**: 5-12 seconds
- **Format**: MP4 (H.264 codec)
- **Quality**: High bitrate for smooth motion

### Creation Guidelines

1. **Subject Positioning**:
   - Center the subject in frame
   - Ensure full upper body is visible
   - Maintain consistent lighting

2. **Movement Patterns**:
   - Natural, human-like motion
   - Avoid abrupt or jerky movements
   - Include subtle breathing animation

3. **Loop Compatibility**:
   - Smooth start and end frames
   - Seamless looping capability
   - Consistent pose at beginning and end

## Usage in Animation Pipeline

### Motion Selection Logic
```python
motion_styles = {
    "gentle": "gentle_breathing.mp4",
    "expressive": "expressive_gestures.mp4", 
    "formal": "formal_pose.mp4",
    "storytelling": "storytelling.mp4",
    "contemplative": "contemplative.mp4"
}
```

### Multi-Segment Animation
For longer animations (20-30 seconds), combine multiple clips:
1. **Intro** (5s): Gentle introduction movement
2. **Main** (15-20s): Primary motion style based on content
3. **Outro** (5s): Concluding gesture or return to rest

## Creating Custom Driving Videos

### Equipment Needed
- High-quality camera (4K recommended)
- Consistent lighting setup
- Green screen (optional, for easier processing)
- Tripod for stable shots

### Recording Process
1. **Setup**: Position subject in center frame, ensure good lighting
2. **Recording**: Capture natural movements at 25+ FPS
3. **Processing**: 
   - Crop to 512x512 square format
   - Stabilize if needed
   - Ensure smooth loop points
   - Export as high-quality MP4

### Quality Checklist
- [ ] Clear, well-lit subject
- [ ] Smooth, natural movements
- [ ] Proper resolution and frame rate
- [ ] No background distractions
- [ ] Seamless loop capability

## Performance Considerations

- **File Size**: Keep videos under 50MB for faster processing
- **Quality vs Speed**: Higher quality videos produce better results but take longer to process
- **GPU Memory**: Longer videos require more VRAM during processing

## Troubleshooting

### Common Issues
1. **Poor Animation Quality**: Check source video resolution and lighting
2. **Jerky Movement**: Ensure smooth motion in driving video
3. **Misaligned Features**: Verify subject positioning and scale

### Optimization Tips
- Use consistent lighting across all driving videos
- Test with various portrait types to ensure compatibility
- Create variations for different portrait orientations (front-facing, three-quarter, profile)