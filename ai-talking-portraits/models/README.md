# AI Models Directory

This directory contains the AI model checkpoints and configuration files needed for portrait animation.

## Required Models

### FOMM (First Order Motion Model)
- **Purpose**: Generates natural body movement and facial animation
- **Files needed**:
  - `fomm/config.yaml` - Model configuration
  - `fomm/checkpoint.pth` - Pre-trained model weights
- **Download**: [FOMM GitHub Repository](https://github.com/AliaksandrSiarohin/first-order-model)

### Wav2Lip
- **Purpose**: Synchronizes lip movements with generated speech
- **Files needed**:
  - `wav2lip/wav2lip_gan.pth` - Pre-trained model weights
- **Download**: [Wav2Lip GitHub Repository](https://github.com/Rudrabha/Wav2Lip)

## Directory Structure

```
models/
├── fomm/
│   ├── config.yaml
│   └── checkpoint.pth
├── wav2lip/
│   └── wav2lip_gan.pth
└── README.md
```

## Setup Instructions

1. **Download FOMM Model**:
   ```bash
   # Create FOMM directory
   mkdir -p models/fomm
   
   # Download the Taichi checkpoint (recommended for full-body portraits)
   wget -O models/fomm/checkpoint.pth [FOMM_CHECKPOINT_URL]
   
   # Download configuration
   wget -O models/fomm/config.yaml [FOMM_CONFIG_URL]
   ```

2. **Download Wav2Lip Model**:
   ```bash
   # Create Wav2Lip directory
   mkdir -p models/wav2lip
   
   # Download the GAN checkpoint (better quality)
   wget -O models/wav2lip/wav2lip_gan.pth [WAV2LIP_CHECKPOINT_URL]
   ```

## Model Requirements

- **GPU Memory**: Minimum 8GB VRAM recommended
- **CUDA**: Compatible CUDA installation required
- **Python**: PyTorch with CUDA support

## Configuration

Update the model paths in your environment configuration:

```env
FOMM_CONFIG_PATH=./models/fomm/config.yaml
FOMM_CHECKPOINT_PATH=./models/fomm/checkpoint.pth
WAV2LIP_CHECKPOINT_PATH=./models/wav2lip/wav2lip_gan.pth
```

## Performance Notes

- **FOMM**: Processing time varies with video length and resolution
- **Wav2Lip**: Faster processing, typically 2-5 seconds per clip
- **Memory Usage**: Models require significant GPU memory during inference

## Troubleshooting

### Common Issues

1. **CUDA Out of Memory**: Reduce batch sizes in configuration
2. **Model Loading Errors**: Verify file paths and permissions
3. **Poor Quality Output**: Ensure high-quality input images and proper lighting

### Optimization Tips

- Use 512x512 resolution for best quality/performance balance
- Ensure input portraits have clear, well-lit faces
- Consider using CPU fallback for development/testing