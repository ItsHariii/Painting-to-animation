import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Clock, AlertCircle, Download, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function AnimationStatus() {
  const { jobId } = useParams()
  const [status, setStatus] = useState({
    status: 'processing',
    progress: 0,
    script: null,
    video_url: null,
    error: null
  })
  
  useEffect(() => {
    // TODO: Implement real-time status polling
    const pollStatus = async () => {
      try {
        // Simulate status updates
        const mockStatuses = [
          { status: 'processing', progress: 20, message: 'Generating script...' },
          { status: 'processing', progress: 40, message: 'Creating speech audio...' },
          { status: 'processing', progress: 60, message: 'Applying motion animation...' },
          { status: 'processing', progress: 80, message: 'Synchronizing lip movements...' },
          { status: 'done', progress: 100, video_url: '/mock-video.mp4', script: 'Generated script content...' }
        ]
        
        let currentStep = 0
        const interval = setInterval(() => {
          if (currentStep < mockStatuses.length) {
            setStatus(prev => ({ ...prev, ...mockStatuses[currentStep] }))
            currentStep++
          } else {
            clearInterval(interval)
          }
        }, 3000)
        
        return () => clearInterval(interval)
      } catch (error) {
        setStatus(prev => ({ 
          ...prev, 
          status: 'error', 
          error: 'Failed to process animation' 
        }))
      }
    }
    
    pollStatus()
  }, [jobId])
  
  const getStatusIcon = () => {
    switch (status.status) {
      case 'processing':
        return <Clock className="w-8 h-8 text-gold-600 animate-pulse" />
      case 'done':
        return <CheckCircle className="w-8 h-8 text-green-600" />
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-600" />
      default:
        return <Clock className="w-8 h-8 text-museum-400" />
    }
  }
  
  const getStatusMessage = () => {
    switch (status.status) {
      case 'processing':
        return status.message || 'Processing your portrait animation...'
      case 'done':
        return 'Your talking portrait is ready!'
      case 'error':
        return status.error || 'An error occurred during processing'
      default:
        return 'Initializing...'
    }
  }
  
  return (
    <div className="min-h-screen py-12 bg-museum-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-museum-900 mb-4">
              Animation Status
            </h1>
            <p className="text-lg text-museum-600">
              Job ID: <span className="font-mono text-sm">{jobId}</span>
            </p>
          </div>
          
          {/* Status Card */}
          <div className="card text-center mb-8">
            <div className="mb-6">
              {getStatusIcon()}
            </div>
            
            <h2 className="text-2xl font-serif font-semibold text-museum-900 mb-4">
              {getStatusMessage()}
            </h2>
            
            {/* Progress Bar */}
            {status.status === 'processing' && (
              <div className="mb-6">
                <div className="w-full bg-museum-200 rounded-full h-3 mb-2">
                  <motion.div
                    className="bg-gold-gradient h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${status.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-museum-600">{status.progress}% complete</p>
              </div>
            )}
            
            {/* Processing Steps */}
            {status.status === 'processing' && (
              <div className="text-left max-w-md mx-auto">
                <div className="space-y-3">
                  {[
                    { step: 'Script Generation', threshold: 20 },
                    { step: 'Text-to-Speech', threshold: 40 },
                    { step: 'Motion Animation', threshold: 60 },
                    { step: 'Lip Synchronization', threshold: 80 },
                    { step: 'Final Processing', threshold: 100 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        status.progress >= item.threshold 
                          ? 'bg-green-500' 
                          : status.progress >= item.threshold - 20
                          ? 'bg-gold-500 animate-pulse'
                          : 'bg-museum-300'
                      }`} />
                      <span className={`text-sm ${
                        status.progress >= item.threshold 
                          ? 'text-green-700 font-medium' 
                          : 'text-museum-600'
                      }`}>
                        {item.step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Results Section */}
          {status.status === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Video Player */}
              <div className="card">
                <h3 className="text-xl font-serif font-semibold text-museum-900 mb-4">
                  Your Talking Portrait
                </h3>
                <div className="aspect-video bg-museum-100 rounded-lg flex items-center justify-center">
                  {status.video_url ? (
                    <video
                      controls
                      className="w-full h-full rounded-lg"
                      poster="/api/placeholder/640/360"
                    >
                      <source src={status.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p className="text-museum-500">Video loading...</p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <button className="btn-primary inline-flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download Video</span>
                  </button>
                  
                  <button className="btn-secondary inline-flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
              
              {/* Generated Script */}
              {status.script && (
                <div className="card">
                  <h3 className="text-xl font-serif font-semibold text-museum-900 mb-4">
                    Generated Script
                  </h3>
                  <div className="bg-museum-50 rounded-lg p-4">
                    <p className="text-museum-700 leading-relaxed italic">
                      "{status.script}"
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Error State */}
          {status.status === 'error' && (
            <div className="card bg-red-50 border-red-200">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Processing Failed
                </h3>
                <p className="text-red-600 mb-6">
                  {status.error || 'An unexpected error occurred while processing your portrait.'}
                </p>
                <Link
                  to="/capture"
                  className="btn-primary"
                >
                  Try Again
                </Link>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <div className="text-center mt-8">
            <Link
              to="/capture"
              className="text-museum-600 hover:text-museum-900 transition-colors"
            >
              ← Create Another Portrait
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}