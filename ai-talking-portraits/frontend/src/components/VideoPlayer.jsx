import { useState, useRef } from 'react'

const VideoPlayer = ({ videoUrl, script, onStartOver }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showScript, setShowScript] = useState(true)
  const videoRef = useRef(null)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  const handleDownload = () => {
    // Create a temporary link to download the video
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = 'talking-portrait.mp4'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Video Section */}
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto max-h-96 object-contain"
          onEnded={handleVideoEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
          preload="metadata"
        />
        
        {/* Custom Play Button Overlay (optional) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <button
              onClick={handlePlayPause}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all"
            >
              <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Script Display */}
        {script && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Generated Script</h3>
              <button
                onClick={() => setShowScript(!showScript)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showScript ? 'Hide' : 'Show'} Script
              </button>
            </div>
            
            {showScript && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {script}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            📥 Download Video
          </button>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(videoUrl)
              // Could add a toast notification here
            }}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            🔗 Copy Link
          </button>
          
          {onStartOver && (
            <button
              onClick={onStartOver}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              🎬 Create Another
            </button>
          )}
        </div>

        {/* Video Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>AI-Generated Talking Portrait</span>
            <span>Ready to share or download</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer