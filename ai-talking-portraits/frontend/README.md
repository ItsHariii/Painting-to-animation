# AI Talking Portraits - Frontend

A modern React frontend for creating AI-powered talking portrait animations.

## 🚀 Features

### Core Functionality
- **Camera Capture**: Direct browser camera access with canvas-based image capture
- **Drag & Drop Upload**: Intuitive file upload with validation
- **Real-time Status**: Live polling of animation processing status
- **Video Playback**: HTML5 video player with download and share options
- **Gallery View**: Showcase of created talking portraits

### User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: CSS-based animations for enhanced UX
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Visual feedback during processing
- **Accessibility**: ARIA labels and keyboard navigation support

### Technical Features
- **React 18**: Latest React with hooks and modern patterns
- **React Router**: Client-side routing for SPA navigation
- **Custom Hooks**: Reusable logic for job status polling
- **API Integration**: RESTful API client with error handling
- **Environment Config**: Configurable API endpoints

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
│   ├── CameraCapture.jsx    # Image capture and upload
│   ├── VideoPlayer.jsx      # Video playback with controls
│   ├── StatusIndicator.jsx  # Processing status display
│   └── Footer.jsx           # Site footer
├── pages/              # Route components
│   ├── PortraitCapture.jsx  # Main creation interface
│   └── Gallery.jsx          # Portrait showcase
├── hooks/              # Custom React hooks
│   └── useJobStatus.js      # Job status polling
├── lib/                # Utilities and services
│   └── api.js              # API client and utilities
├── assets/             # Static assets
└── App.jsx             # Main application component
```

## 🎨 Design System

### Color Palette
- **Primary**: Museum-inspired warm browns and golds
- **Secondary**: Cream and sage accents
- **Interactive**: Gold highlights for buttons and links

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Display**: Crimson Text for special elements

### Components
- **Buttons**: Primary, secondary, and ghost variants
- **Cards**: Elevated and standard variants with hover effects
- **Forms**: Consistent input styling with focus states
- **Status**: Success, error, and warning indicators

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000
```

### API Endpoints
- `POST /animate` - Create talking portrait animation
- `GET /status/{job_id}` - Get processing status
- `GET /audio/{job_id}` - Get generated audio file

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Testing
```bash
node test-frontend.cjs
```

## 📱 Components Guide

### CameraCapture
Main component for image upload and processing initiation.

**Features:**
- Camera access via `getUserMedia()`
- Drag & drop file upload
- Image validation (JPG/PNG, max 10MB)
- Context input for script generation
- Real-time status updates

**Props:**
- `onVideoGenerated(result)` - Callback when video is ready
- `onError(message)` - Error handling callback

### VideoPlayer
Video playback component with enhanced controls.

**Features:**
- HTML5 video with custom overlay
- Download and share functionality
- Script display with toggle
- Fullscreen support

**Props:**
- `videoUrl` - URL of the generated video
- `script` - Generated script text
- `onStartOver()` - Callback to restart process

### StatusIndicator
Real-time processing status display.

**Features:**
- Progress bar with percentage
- Step-by-step processing breakdown
- Error and success states
- Animated transitions

**Props:**
- `status` - Current processing status
- `progress` - Completion percentage (0-100)
- `message` - Status message
- `jobId` - Unique job identifier
- `showDetails` - Show detailed step breakdown

### useJobStatus Hook
Custom hook for polling job status.

**Usage:**
```jsx
const { status, progress, data, error } = useJobStatus(jobId, 2000, enabled)
```

**Returns:**
- `status` - Current job status
- `progress` - Processing progress (0-100)
- `data` - Full status response
- `error` - Error message if any
- `resetStatus()` - Reset status state

## 🎯 User Flow

1. **Landing Page**: Animated homepage with call-to-action
2. **Image Upload**: Camera capture or file upload with validation
3. **Context Input**: Optional context for script generation
4. **Processing**: Real-time status updates with progress bar
5. **Result**: Video playback with script display
6. **Gallery**: Browse created portraits

## 🔄 State Management

The frontend uses React's built-in state management:
- **Local State**: Component-specific state with `useState`
- **Custom Hooks**: Shared logic like job status polling
- **Context**: Minimal use, mainly for theme/config

## 🎨 Styling

Built with Tailwind CSS for:
- **Utility-first**: Rapid development with utility classes
- **Responsive**: Mobile-first responsive design
- **Custom Theme**: Extended with museum-inspired colors
- **Animations**: CSS-based animations for smooth UX

## 🚀 Performance

### Optimizations
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Proper image handling and validation
- **API Caching**: Intelligent caching of API responses
- **Bundle Size**: Minimal dependencies for fast loading

### Monitoring
- **Error Boundaries**: Graceful error handling
- **Loading States**: Visual feedback for all async operations
- **Performance Metrics**: Built-in performance monitoring

## 🔒 Security

- **Input Validation**: Client and server-side validation
- **File Type Checking**: Strict image format validation
- **Size Limits**: File size restrictions
- **CORS**: Proper cross-origin request handling

## 🌐 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: Camera API, File API, Canvas API

## 📈 Future Enhancements

- **Offline Support**: Service worker for offline functionality
- **PWA**: Progressive Web App capabilities
- **Advanced Editing**: Video editing and customization
- **Social Sharing**: Enhanced sharing capabilities
- **Analytics**: User interaction tracking