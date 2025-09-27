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
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background Elements - matching landing page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-400/15 to-warm-400/15 rounded-full blur-3xl animate-gentle-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-warm-400/15 to-primary-400/15 rounded-full blur-3xl animate-gentle-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-600/8 to-warm-600/8 rounded-full blur-2xl animate-pulse-soft"></div>
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 via-transparent to-warm-50/20"></div>

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!generatedVideo ? (
            /* Enhanced Camera Capture Interface */
            <div className="animate-fade-in">
              {/* Premium Header Section */}
              <div className="text-center mb-16">

                
                <h1 className="text-6xl md:text-8xl font-catchy font-bold text-primary-900 mb-8 leading-tight">
                  Create Your
                  <br />
                  <span className="metallic-gold">Talking Portrait</span>
                </h1>
                

              </div>

              <CameraCapture 
                onVideoGenerated={handleVideoGenerated}
                onError={handleError}
              />
            </div>
          ) : (
            /* Enhanced Video Result Interface */
            <div className="animate-fade-in">
              {/* Success Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-400/30 rounded-full mb-8 shadow-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4 animate-pulse"></div>
                  <span className="text-green-700 font-catchy font-semibold text-lg">Portrait Successfully Created</span>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full ml-4 animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-catchy font-bold text-primary-900 mb-8 leading-tight">
                  Your Portrait
                  <br />
                  <span className="metallic-gold">Speaks!</span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-primary-600 font-catchy max-w-5xl mx-auto leading-relaxed">
                  Watch your creation come to life with AI-generated speech and animation
                </p>
              </div>

              <VideoPlayer 
                videoUrl={generatedVideo.video_url}
                script={generatedVideo.script}
                onStartOver={handleStartOver}
              />
            </div>
          )}

          {/* Enhanced Error Display */}
          {error && (
            <div className="mt-16 animate-slide-up">
              <div className="max-w-4xl mx-auto">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-red-200/50">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-catchy font-bold text-primary-900 mb-4">Something went wrong</h3>
                        <p className="text-xl text-primary-700 mb-8 leading-relaxed">{error}</p>
                        <button
                          onClick={handleStartOver}
                          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 font-catchy font-semibold text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}