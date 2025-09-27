import { useState, useEffect } from 'react'
import { createAnimation, validateImageFile } from '../lib/api'

const CameraCapture = ({ onVideoGenerated, onError }) => {
  const [capturedImage, setCapturedImage] = useState(null)
  const [context, setContext] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)



  // Handle file upload from input
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setError(null)
    const imageUrl = URL.createObjectURL(file)
    setCapturedImage({
      blob: file,
      url: imageUrl,
      file: file
    })
  }

  // Reset to capture new image
  const resetCapture = () => {
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url)
    }
    setCapturedImage(null)
    setContext('')
    setError(null)
  }

  // Upload image and generate animation
  const handleUpload = async () => {
    if (!capturedImage || !context.trim()) {
      setError('Please capture an image and provide context.')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const result = await createAnimation(
        capturedImage.file,
        context.trim(),
        'wave_5s', // Default motion style
        5 // Default duration
      )

      if (result.status === 'done') {
        onVideoGenerated?.(result)
      } else if (result.status === 'error') {
        setError(result.error || 'Failed to generate animation')
        onError?.(result.error)
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (capturedImage?.url) {
        URL.revokeObjectURL(capturedImage.url)
      }
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Create Talking Portrait
      </h2>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start space-x-2">
            <span className="text-red-500 text-lg">⚠️</span>
            <div className="flex-1">
              <p className="text-red-700 text-sm">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload or Preview */}
      <div className="mb-6">
        {!capturedImage ? (
          /* Upload Controls */
          <div className="flex flex-col items-center space-y-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-gray-500 text-center">
              <p className="text-lg font-medium mb-2">Upload or Take a Photo</p>
              <p className="text-sm">Choose an image from your device or use your camera</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Camera Button */}
              <label className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors text-center">
                📷 Take Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              
              {/* Upload Button */}
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors text-center">
                📁 Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-xs text-gray-400 text-center max-w-md">
              <p>💡 Use "Take Photo" to open camera or "Upload Image" to choose from your device</p>
              <p>Supports JPG, PNG up to 10MB</p>
            </div>
          </div>
        ) : (
          /* Image Preview */
          <div className="relative">
            <img
              src={capturedImage.url}
              alt="Selected portrait"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={resetCapture}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
              title="Choose different image"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Context Input Form */}
      {capturedImage && (
        <div className="space-y-4">
          <div>
            <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
              Context (Optional)
            </label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe who this person is, their time period, or what they should talk about..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {context.length}/500 characters
            </p>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading || !context.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Animation...
              </span>
            ) : (
              '🎬 Generate Talking Portrait'
            )}
          </button>
        </div>
      )}


    </div>
  )
}

export default CameraCapture