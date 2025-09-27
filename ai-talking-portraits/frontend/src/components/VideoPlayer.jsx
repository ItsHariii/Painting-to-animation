import { useState, useRef } from 'react'

const VideoPlayer = ({ videoUrl, script, onStartOver }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showScript, setShowScript] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
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

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen?.() || 
        videoRef.current.webkitRequestFullscreen?.() || 
        videoRef.current.mozRequestFullScreen?.()
      } else {
        document.exitFullscreen?.() || 
        document.webkitExitFullscreen?.() || 
        document.mozCancelFullScreen?.()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Talking Portrait',
          text: 'Check out this amazing talking portrait created with AI!',
          url: videoUrl,
        })
      } catch (err) {
        console.log('Error sharing:', err)
        // Fallback to clipboard
        navigator.clipboard.writeText(videoUrl)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(videoUrl)
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold text-museum-900 mb-3 text-shadow">
          Your Talking Portrait
        </h2>
        <p className="text-lg text-museum-600 max-w-2xl mx-auto leading-relaxed">
          Experience history come alive through AI-powered animation and voice synthesis
        </p>
      </div>

      {/* Video Player Card */}
      <div className="card-elevated overflow-hidden mb-8">
        {/* Video Section */}
        <div className="relative bg-gradient-to-br from-museum-900 to-museum-800">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-auto max-h-[70vh] object-contain rounded-t-2xl"
            onEnded={handleVideoEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls
            preload="metadata"
            style={{
              filter: 'contrast(1.05) saturate(1.1)',
            }}
          />
          
          {/* Custom Play Button Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-xs rounded-t-2xl">
              <button
                onClick={handlePlayPause}
                className="bg-white/95 hover:bg-white backdrop-blur-sm rounded-full p-6 transition-all duration-300 transform hover:scale-110 shadow-large"
              >
                <svg className="w-12 h-12 text-museum-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          )}

          {/* Video Controls Overlay */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleFullscreen}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm transition-all duration-200"
              title="Fullscreen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Script Display */}
          {script && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-serif font-semibold text-museum-900 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Generated Script
                </h3>
                <button
                  onClick={() => setShowScript(!showScript)}
                  className="btn-ghost text-sm"
                >
                  {showScript ? (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.415 1.415m4.243-4.243L14.121 9.878m0 0L12.707 8.464m1.414 1.414l1.415-1.414" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                  {showScript ? 'Hide' : 'Show'} Script
                </button>
              </div>
              
              {showScript && (
                <div className="bg-gradient-to-br from-museum-50 to-cream-50 rounded-xl p-6 border border-museum-200 shadow-inner-soft">
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold-400 to-gold-600 rounded-full"></div>
                    <p className="text-museum-800 leading-relaxed text-lg italic pl-6 whitespace-pre-wrap font-serif">
                      "{script}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={handleDownload}
              className="btn-primary justify-center py-3"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Video
            </button>
            
            <button
              onClick={handleShare}
              className="btn-secondary justify-center py-3"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Portrait
            </button>
            
            {onStartOver && (
              <button
                onClick={onStartOver}
                className="btn-secondary justify-center py-3 border-sage-300 text-sage-700 hover:bg-sage-50 hover:border-sage-400"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Create Another
              </button>
            )}
          </div>

          {/* Video Info */}
          <div className="bg-museum-50 rounded-xl p-6 border border-museum-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-100 to-cream-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="font-serif font-semibold text-museum-900">AI-Generated Talking Portrait</p>
                  <p className="text-sm text-museum-600">Powered by advanced machine learning</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-museum-700">Ready to share</p>
                <p className="text-xs text-museum-500">High-quality video output</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer