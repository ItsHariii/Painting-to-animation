import { useState, useEffect } from 'react'

const StatusIndicator = ({ 
  status = 'idle', 
  progress = 0, 
  message = '', 
  jobId = null,
  onStatusUpdate = null,
  showDetails = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  // Processing steps for animation pipeline
  const processingSteps = [
    { id: 'analyzing', label: 'Analyzing Image', icon: '🔍', duration: 5 },
    { id: 'script', label: 'Generating Script', icon: '📝', duration: 10 },
    { id: 'tts', label: 'Creating Voice', icon: '🎤', duration: 8 },
    { id: 'animation', label: 'Animating Portrait', icon: '🎭', duration: 30 },
    { id: 'lipsync', label: 'Syncing Lips', icon: '👄', duration: 15 },
    { id: 'finalizing', label: 'Finalizing Video', icon: '🎬', duration: 5 }
  ]

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  // Update current step based on progress
  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * processingSteps.length)
    setCurrentStep(Math.min(stepIndex, processingSteps.length - 1))
  }, [progress])

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
      case 'running':
        return 'text-blue-600'
      case 'done':
      case 'completed':
        return 'text-green-600'
      case 'error':
      case 'failed':
        return 'text-red-600'
      case 'waiting':
        return 'text-amber-600'
      default:
        return 'text-museum-600'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
      case 'running':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      case 'done':
      case 'completed':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'error':
      case 'failed':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      case 'waiting':
        return (
          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getStatusMessage = () => {
    if (message) return message
    
    switch (status) {
      case 'processing':
      case 'running':
        return processingSteps[currentStep]?.label || 'Processing...'
      case 'done':
      case 'completed':
        return 'Portrait generation completed!'
      case 'error':
      case 'failed':
        return 'Something went wrong during processing'
      case 'waiting':
        return 'Waiting to start processing...'
      default:
        return 'Ready to begin'
    }
  }

  if (status === 'idle') return null

  return (
    <div className="card-elevated p-6 animate-slide-up">
      {/* Main Status Display */}
      <div className="flex items-center space-x-4 mb-6">
        <div className={`flex-shrink-0 ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-serif font-semibold text-museum-900 text-lg">
            {getStatusMessage()}
          </h3>
          {jobId && (
            <p className="text-sm text-museum-500 font-mono mt-1">
              Job ID: {jobId}
            </p>
          )}
        </div>
        {(status === 'processing' || status === 'running') && (
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {Math.round(animatedProgress)}%
            </div>
            <div className="text-xs text-museum-500">Complete</div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {(status === 'processing' || status === 'running') && (
        <div className="mb-6">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-museum-500 mt-2">
            <span>Started</span>
            <span>
              {animatedProgress < 100 ? 'In Progress' : 'Finalizing'}
            </span>
          </div>
        </div>
      )}

      {/* Detailed Steps (when processing) */}
      {showDetails && (status === 'processing' || status === 'running') && (
        <div className="space-y-3">
          <h4 className="font-medium text-museum-700 text-sm uppercase tracking-wide">
            Processing Steps
          </h4>
          <div className="space-y-2">
            {processingSteps.map((step, index) => {
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep
              const isUpcoming = index > currentStep
              
              return (
                <div 
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-50 border border-green-200' 
                      : isCurrent 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-museum-50 border border-museum-200'
                  }`}
                >
                  <div className="flex-shrink-0 text-lg">
                    {isCompleted ? '✅' : isCurrent ? step.icon : '⏳'}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isCompleted 
                        ? 'text-green-800' 
                        : isCurrent 
                          ? 'text-blue-800' 
                          : 'text-museum-600'
                    }`}>
                      {step.label}
                    </div>
                    <div className="text-xs text-museum-500">
                      ~{step.duration}s
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isCompleted && (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {isCurrent && (
                      <svg className="w-4 h-4 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Error Details */}
      {status === 'error' && message && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-red-800 mb-1">Error Details</h4>
              <p className="text-sm text-red-700">{message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {status === 'done' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-green-800">Success!</h4>
              <p className="text-sm text-green-700">Your talking portrait is ready to view.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatusIndicator