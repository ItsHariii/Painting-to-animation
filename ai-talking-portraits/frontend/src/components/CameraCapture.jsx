import { useState, useEffect } from 'react'
import { createAnimation, validateImageFile } from '../lib/api'
import { convertToPng, validateImageForConversion, getFileTypeName } from '../lib/imageConverter'
import StatusIndicator from './StatusIndicator'
import useJobStatus from '../hooks/useJobStatus'
import { initScrollAnimations } from '../utils/scrollAnimations'

const CameraCapture = ({ onVideoGenerated, onError }) => {
  const [capturedImage, setCapturedImage] = useState(null)
  const [context, setContext] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [currentJobId, setCurrentJobId] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState('')

  // Use job status polling hook
  const {
    status: jobStatus,
    data: jobData,
    progress,
    loading: statusLoading,
    error: statusError,
    resetStatus
  } = useJobStatus(currentJobId, 2000, !!currentJobId)



  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  // Handle file upload from input
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    processFile(file)
  }

  // Process uploaded file
  const processFile = async (file) => {
    const validation = validateImageForConversion(file)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setError(null)
    setIsConverting(true)

    try {
      let processedFile = file

      if (validation.needsConversion) {
        const originalType = getFileTypeName(file)
        setConversionProgress(`Converting ${originalType} to PNG...`)

        // Convert to PNG
        processedFile = await convertToPng(file, {
          maxWidth: 2048,
          maxHeight: 2048,
          quality: 0.9
        })

        setConversionProgress(`Conversion complete! ${originalType} → PNG`)

        // Show success message briefly
        setTimeout(() => {
          setConversionProgress('')
        }, 2000)
      }

      const imageUrl = URL.createObjectURL(processedFile)
      setCapturedImage({
        blob: processedFile,
        url: imageUrl,
        file: processedFile,
        originalFile: file,
        wasConverted: validation.needsConversion
      })

    } catch (conversionError) {
      console.error('Image conversion failed:', conversionError)
      setError(`Failed to convert image: ${conversionError.message}`)
    } finally {
      setIsConverting(false)
    }
  }

  // Reset to capture new image
  const resetCapture = () => {
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url)
    }
    setCapturedImage(null)
    setContext('')
    setError(null)
    setResult(null)
    setCurrentJobId(null)
    resetStatus()
  }

  // Upload image and generate animation
  const handleUpload = async () => {
    if (!capturedImage) {
      setError('Please capture an image first.')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const response = await createAnimation(
        capturedImage.file,
        context.trim() || '', // Allow empty context
        'wave_5s', // Default motion style
        5 // Default duration
      )

      console.log('Animation response:', response)
      setResult(response)

      // Set job ID for status polling
      if (response.job_id) {
        setCurrentJobId(response.job_id)
      }

      if (response.status === 'script_and_audio_ready') {
        // Script and audio generation completed successfully
        onVideoGenerated?.(response)
      } else if (response.status === 'error') {
        setError(response.error || 'Failed to generate animation')
        onError?.(response.error)
      } else if (response.status === 'processing') {
        // Job is processing, status polling will handle updates
        // Don't call onVideoGenerated yet, wait for completion
      } else {
        // Other statuses
        onVideoGenerated?.(response)
      }
    } catch (err) {
      console.error('Upload error:', err)
      const errorMessage = err.message || 'Failed to upload image. Please try again.'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  // Handle job status updates
  useEffect(() => {
    if (jobStatus === 'done' || jobStatus === 'completed') {
      if (jobData?.video_url) {
        // Job completed with video
        onVideoGenerated?.(jobData)
      } else if (jobData) {
        // Job completed but might be intermediate step
        setResult(jobData)
      }
    } else if (jobStatus === 'error' || jobStatus === 'failed') {
      const errorMsg = jobData?.error || statusError || 'Processing failed'
      setError(errorMsg)
      onError?.(errorMsg)
    }
  }, [jobStatus, jobData, statusError, onVideoGenerated, onError])

  // Initialize scroll animations
  useEffect(() => {
    const timer = setTimeout(() => {
      initScrollAnimations();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (capturedImage?.url) {
        URL.revokeObjectURL(capturedImage.url)
      }
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto animate-fade-in relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Enhanced Background Elements - Mobile Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-r from-primary-400/20 to-warm-400/20 rounded-full blur-3xl animate-gentle-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-gradient-to-r from-warm-400/20 to-primary-400/20 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-primary-600/10 to-warm-600/10 rounded-full blur-2xl animate-pulse-soft"></div>
      </div>

      {/* Main Content Card - Mobile Optimized */}
      <div className="relative group mb-8 sm:mb-12 lg:mb-16 scroll-fade-up">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-warm-400/20 rounded-2xl sm:rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 shadow-2xl border border-primary-200/50 group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-[1.01]">
          {/* Enhanced Error Display with Advanced Animations - Mobile Responsive */}
          {error && (
            <div className="mb-6 sm:mb-8 lg:mb-12 animate-slide-up scroll-fade-up">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg sm:text-xl font-catchy font-bold text-red-800 mb-2 group-hover:text-red-900 transition-colors duration-300">Upload Error</h4>
                      <p className="text-red-700 text-base sm:text-lg group-hover:text-red-800 transition-colors duration-300 break-words">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Conversion Status Display with Magical Effects */}
          {(isConverting || conversionProgress) && (
            <div className="mb-12 animate-slide-up scroll-fade-up">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse-soft"></div>
                <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {isConverting ? (
                          <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-white animate-bounce-slow" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-catchy font-bold text-blue-800 mb-2 group-hover:text-blue-900 transition-colors duration-300">
                        {isConverting ? 'Converting Image' : 'Conversion Complete'}
                      </h4>
                      <p className="text-blue-700 text-lg group-hover:text-blue-800 transition-colors duration-300">{conversionProgress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Image Upload or Preview */}
          <div className="mb-12">
            {!capturedImage ? (
              /* Premium Upload Area with Magical Animations */
              <div
                className={`relative group transition-all duration-500 scroll-scale ${dragActive ? 'scale-105 animate-glow-pulse' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {/* Enhanced Magical Background Particles */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-primary-300/30 to-warm-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0s' }}></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-warm-300/30 to-primary-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-1/4 -right-6 w-4 h-4 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute bottom-1/3 -left-8 w-5 h-5 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.9s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-yellow-300/40 to-orange-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" style={{ animationDelay: '1.2s' }}></div>

                <div className={`relative bg-gradient-to-br from-primary-50 to-warm-50 border-2 border-dashed transition-all duration-300 rounded-3xl p-16 text-center transform group-hover:scale-[1.02] ${dragActive
                  ? 'border-primary-400 bg-primary-100/50 shadow-2xl scale-105'
                  : 'border-primary-200 hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-xl'
                  }`}>
                  <div className="space-y-8">
                    {/* Enhanced Upload Icon with Magical Effects */}
                    <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-primary-600 to-warm-600 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500 animate-gentle-float">
                      {/* Magical glow ring */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-warm-400/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-soft"></div>
                      {/* Rotating border */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-primary-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gentle-float" style={{ animationDelay: '0.5s' }}></div>
                      <svg className="relative w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {/* Sparkle effects */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    </div>

                    {/* Enhanced Upload Text with Animations */}
                    <div className="space-y-4 scroll-fade-up">
                      <h3 className="text-4xl font-catchy font-bold text-primary-900 group-hover:scale-105 transition-transform duration-300">
                        Upload Your Portrait
                      </h3>
                      <p className="text-xl text-primary-600 max-w-2xl mx-auto leading-relaxed group-hover:text-primary-700 transition-colors duration-300">
                        Drag and drop an image here, or click to browse your files
                      </p>
                    </div>

                    {/* Premium Upload Buttons with Enhanced Animations */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center stagger-children">
                      {/* Camera Capture */}
                      <label className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 font-catchy font-semibold text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl cursor-pointer overflow-hidden" data-stagger>
                        <div className="absolute inset-0 bg-gradient-to-r from-warm-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <svg className="relative w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="relative">Take Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      {/* File Upload */}
                      <label className="group relative inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-primary-400 hover:border-warm-400 text-primary-700 hover:text-warm-700 font-catchy font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-primary-50 cursor-pointer overflow-hidden" data-stagger>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-warm-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <svg className="relative w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="relative">Browse Files</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Enhanced File Requirements with Hover Effects */}
                    <div className="relative group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-200/50 hover:bg-white/90 hover:border-primary-300/60 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg scroll-fade-up">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-warm-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative text-primary-600 space-y-2">
                        <p className="font-catchy font-semibold text-lg group-hover:text-primary-700 transition-colors duration-300">Supported formats:</p>
                        <p className="text-lg group-hover:text-primary-700 transition-colors duration-300">JPG, PNG, HEIC, WebP • Maximum size: 10MB</p>
                        <p className="text-lg group-hover:text-primary-700 transition-colors duration-300">Best results with clear, well-lit portraits</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Premium Image Preview with Enhanced Effects */
              <div className="relative group animate-slide-up scroll-scale">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-warm-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse-soft"></div>
                <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-[1.02]">
                  <img
                    src={capturedImage.url}
                    alt="Selected portrait"
                    className="w-full h-96 sm:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/20 transition-all duration-500"></div>

                  {/* Enhanced Remove Button with Magical Effects */}
                  <button
                    onClick={resetCapture}
                    className="absolute top-6 right-6 bg-white/95 hover:bg-white text-primary-700 hover:text-red-600 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 backdrop-blur-sm group/btn"
                    title="Choose different image"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <svg className="relative w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Enhanced Image Info Overlay with Animations */}
                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group/info">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-warm-50/50 rounded-2xl opacity-0 group-hover/info:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <p className="text-lg font-catchy font-semibold text-primary-900 group-hover/info:text-primary-800 transition-colors duration-300">
                        {capturedImage.file.name}
                      </p>
                      <p className="text-primary-600 font-catchy group-hover/info:text-primary-700 transition-colors duration-300">
                        {(capturedImage.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      {capturedImage.wasConverted && (
                        <div className="flex items-center mt-2 animate-fade-in">
                          <svg className="w-4 h-4 text-green-600 mr-2 animate-bounce-slow" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-green-700 font-medium">Converted to PNG</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Context Input Form with Magical Animations */}
          {capturedImage && (
            <div className="space-y-10 animate-slide-up scroll-fade-up">
              <div className="space-y-6">
                <label htmlFor="context" className="block text-3xl font-catchy font-bold text-primary-900 scroll-fade-left">
                  Add Context <span className="text-primary-500 font-normal text-xl animate-pulse">(Optional)</span>
                </label>
                <p className="text-xl text-primary-600 leading-relaxed scroll-fade-right">
                  Provide details about the person, time period, or what they should discuss.
                  Leave empty for AI to generate a generic historical portrait script.
                </p>
                <div className="relative group scroll-scale">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-warm-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Example: This is Leonardo da Vinci, the Renaissance master artist and inventor from the 15th century. He should discuss his artistic techniques and scientific discoveries..."
                    className="relative w-full h-40 px-6 py-4 text-lg border-2 border-primary-200 rounded-2xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:border-primary-300 hover:shadow-lg"
                    maxLength={500}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50/30 to-warm-50/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex justify-between items-center text-lg scroll-fade-up">
                  <span className="text-primary-500 font-catchy hover:text-primary-600 transition-colors duration-300">
                    Leave empty for generic script
                  </span>
                  <span className={`font-catchy font-semibold transition-all duration-300 ${context.length > 450 ? 'text-amber-600 animate-pulse' : 'text-primary-500'}`}>
                    {context.length}/500 characters
                  </span>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="group relative w-full inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 font-catchy font-bold text-2xl text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-2xl overflow-hidden scroll-scale"
              >
                {/* Enhanced magical background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-warm-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-warm-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-soft"></div>

                {/* Sparkle effects */}
                <div className="absolute top-2 right-4 w-2 h-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                <div className="absolute bottom-3 left-6 w-1.5 h-1.5 bg-warm-200/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping" style={{ animationDelay: '0.5s' }}></div>

                {isUploading ? (
                  <span className="flex items-center justify-center relative z-10">
                    <svg className="animate-spin -ml-1 mr-4 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="animate-pulse">Generating Your Talking Portrait...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center relative z-10">
                    <svg className="w-8 h-8 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="group-hover:scale-105 transition-transform duration-300">Generate Talking Portrait</span>
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Status Indicator with Animations */}
        {(isUploading || currentJobId) && (
          <div className="scroll-fade-up animate-slide-up">
            <StatusIndicator
              status={isUploading ? 'processing' : jobStatus}
              progress={progress}
              message={jobData?.message || statusError}
              jobId={currentJobId}
              showDetails={true}
            />
          </div>
        )}

        {/* Enhanced Results Display with Magical Animations */}
        {result && (
          <div className="relative group card-elevated p-8 animate-slide-up scroll-fade-up">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative text-center mb-6">
              <div className="relative w-16 h-16 bg-gradient-to-br from-green-100 to-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 animate-bounce-slow">
                <div className="absolute inset-0 bg-gradient-to-br from-green-200/50 to-emerald-200/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-soft"></div>
                <svg className="relative w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-museum-900 mb-2 group-hover:scale-105 transition-transform duration-300">
                Generation Complete!
              </h3>
              <p className="text-museum-600 group-hover:text-museum-700 transition-colors duration-300">
                Your talking portrait has been successfully created
              </p>
            </div>

            {result.script && (
              <div className="mb-6">
                <h4 className="text-lg font-serif font-semibold text-museum-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Generated Script
                </h4>
                <div className="bg-gradient-to-br from-museum-50 to-cream-50 p-6 rounded-xl border border-museum-200">
                  <p className="text-museum-800 leading-relaxed italic text-lg">
                    "{result.script}"
                  </p>
                </div>
              </div>
            )}

            {result.processing?.audio_generated && result.job_id && (
              <div className="mb-6">
                <h4 className="text-lg font-serif font-semibold text-museum-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  Generated Speech
                </h4>
                <div className="bg-white p-6 rounded-xl border border-museum-200 shadow-soft">
                  <audio
                    controls
                    className="w-full h-12 rounded-lg"
                    preload="metadata"
                    style={{
                      filter: 'sepia(20%) saturate(70%) hue-rotate(15deg)',
                    }}
                  >
                    <source
                      src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/audio/${result.job_id}`}
                      type="audio/wav"
                    />
                    Your browser does not support the audio element.
                  </audio>
                  <p className="text-sm text-museum-500 mt-3 text-center">
                    🎧 Click play to hear the AI-generated voice
                  </p>
                </div>
              </div>
            )}

            {result.processing && (
              <div className="mb-6">
                <h4 className="text-lg font-serif font-semibold text-museum-900 mb-4">Processing Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-museum-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-museum-700">Script Generated</span>
                      <span className={`flex items-center ${result.processing.script_generated ? 'text-green-600' : 'text-red-600'}`}>
                        {result.processing.script_generated ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-museum-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-museum-700">Audio Generated</span>
                      <span className={`flex items-center ${result.processing.audio_generated ? 'text-green-600' : 'text-red-600'}`}>
                        {result.processing.audio_generated ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-museum-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-museum-700">Script Length</span>
                      <span className="text-museum-600 font-mono">{result.processing.script_length} chars</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-museum-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-museum-700">Duration</span>
                      <span className="text-museum-600 font-mono">{result.processing.estimated_duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-museum-50 p-4 rounded-xl border border-museum-200 mb-6">
              <div className="text-sm text-museum-600 space-y-1">
                <p><span className="font-medium">Job ID:</span> <span className="font-mono">{result.job_id}</span></p>
                <p><span className="font-medium">Status:</span> <span className="capitalize">{result.status}</span></p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={resetCapture}
                className="btn-secondary px-8 py-3"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Create Another Portrait
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Tips Section */}
        <div className="relative group mt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-warm-400/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-primary-200/50 group-hover:shadow-3xl transition-all duration-500">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600/20 to-warm-600/20 backdrop-blur-sm border border-primary-400/30 rounded-full mb-6">
                <div className="w-2 h-2 bg-warm-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-primary-700 font-catchy font-semibold">Expert Guidelines</span>
              </div>
              <h3 className="text-5xl font-catchy font-bold text-primary-900 mb-4">
                Tips for Best Results
              </h3>
              <p className="text-xl text-primary-600 max-w-3xl mx-auto leading-relaxed">
                Follow these professional guidelines to create stunning talking portraits
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-2xl font-catchy font-bold text-primary-900 mb-4">Image Quality</h4>
                    <ul className="space-y-3 text-primary-700 text-lg">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-4"></div>
                        Use high-resolution images (minimum 512x512px)
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-4"></div>
                        Ensure the face is clearly visible and well-lit
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-4"></div>
                        Avoid blurry or heavily shadowed images
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-4"></div>
                        Portrait orientation works best
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-warm-600 to-warm-700 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-2xl font-catchy font-bold text-primary-900 mb-4">Context Details</h4>
                    <ul className="space-y-3 text-primary-700 text-lg">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-warm-500 rounded-full mr-4"></div>
                        Include historical period and significance
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-warm-500 rounded-full mr-4"></div>
                        Mention the subject's role or profession
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-warm-500 rounded-full mr-4"></div>
                        Add interesting facts or stories
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-warm-500 rounded-full mr-4"></div>
                        Be specific for more authentic dialogue
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-warm-50 rounded-2xl p-8 border border-primary-200/50">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-warm-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-catchy font-bold text-primary-800 mb-3">Pro Tip</h4>
                  <p className="text-primary-700 text-lg leading-relaxed">
                    For museum installations, consider using professional portrait photography with consistent lighting.
                    The AI works best with formal portraits where the subject is looking directly at the camera.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CameraCapture