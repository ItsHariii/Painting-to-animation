import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CameraCapture from '../components/CameraCapture'
import VideoPlayer from '../components/VideoPlayer'

export function PortraitCapture() {
  const [generatedVideo, setGeneratedVideo] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
  const handleVideoGenerated = (result) => {
    setGeneratedVideo(result)
    setError(null)
  }

  const handleError = (errorMessage) => {
    setError(errorMessage)
    setGeneratedVideo(null)
  }

  const handleStartOver = () => {
    setGeneratedVideo(null)
    setError(null)
  }
  
  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!generatedVideo ? (
          /* Camera Capture Interface */
          <CameraCapture 
            onVideoGenerated={handleVideoGenerated}
            onError={handleError}
          />
        ) : (
          /* Video Result Interface */
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Talking Portrait is Ready!
              </h2>
              <p className="text-gray-600">
                Here's your animated portrait with generated dialogue
              </p>
            </div>
            
            <VideoPlayer 
              videoUrl={generatedVideo.video_url}
              script={generatedVideo.script}
              onStartOver={handleStartOver}
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
            <button
              onClick={handleStartOver}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tips for Best Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2 text-gray-900">Image Quality</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Use high-resolution images when possible</li>
                <li>• Ensure the face is clearly visible and well-lit</li>
                <li>• Avoid blurry or heavily shadowed images</li>
                <li>• Portrait orientation works best</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-gray-900">Context</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Include historical period and significance</li>
                <li>• Mention the subject's role or profession</li>
                <li>• Add interesting facts or stories</li>
                <li>• Be specific for more authentic dialogue</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}