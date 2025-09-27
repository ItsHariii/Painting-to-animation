import React, { useState, useRef } from 'react'
import { Camera, Upload, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function PortraitCapture() {
  const [capturedImage, setCapturedImage] = useState(null)
  const [context, setContext] = useState('')
  const [motionStyle, setMotionStyle] = useState('gentle')
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  
  const motionStyles = [
    { id: 'gentle', name: 'Gentle Movement', description: 'Subtle breathing and slight head movement' },
    { id: 'expressive', name: 'Expressive', description: 'More animated gestures and expressions' },
    { id: 'formal', name: 'Formal Pose', description: 'Dignified, minimal movement suitable for formal portraits' }
  ]
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!capturedImage || !context.trim()) {
      alert('Please provide both an image and context for the portrait.')
      return
    }
    
    setIsProcessing(true)
    
    // TODO: Implement API call to backend
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate to status page
      // navigate(`/status/${jobId}`)
      
    } catch (error) {
      console.error('Error processing portrait:', error)
      alert('Error processing portrait. Please try again.')
    } finally {
      setIsProcessing(false)
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-museum-900 mb-4">
              Create Your Talking Portrait
            </h1>
            <p className="text-lg text-museum-600 max-w-2xl mx-auto">
              Upload a portrait image and provide historical context to bring it to life with AI animation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Capture/Upload Section */}
            <div className="card">
              <h2 className="text-2xl font-serif font-semibold text-museum-900 mb-6">
                Portrait Image
              </h2>
              
              {!capturedImage ? (
                <div className="space-y-4">
                  {/* Upload Button */}
                  <div 
                    className="border-2 border-dashed border-museum-300 rounded-lg p-8 text-center cursor-pointer hover:border-gold-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-museum-400 mx-auto mb-4" />
                    <p className="text-museum-600 mb-2">Click to upload a portrait image</p>
                    <p className="text-sm text-museum-500">JPG, PNG up to 10MB</p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {/* Camera Capture (Future Enhancement) */}
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn-secondary inline-flex items-center space-x-2"
                      disabled
                    >
                      <Camera className="w-4 h-4" />
                      <span>Use Camera (Coming Soon)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured portrait"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-museum-600 text-center">
                    Portrait image ready for animation
                  </p>
                </div>
              )}
            </div>
            
            {/* Configuration Section */}
            <div className="card">
              <h2 className="text-2xl font-serif font-semibold text-museum-900 mb-6">
                Animation Settings
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Context Input */}
                <div>
                  <label className="block text-sm font-medium text-museum-700 mb-2">
                    Historical Context
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Describe the historical figure, time period, or context for the portrait. This will help generate appropriate dialogue..."
                    className="input-field h-32 resize-none"
                    required
                  />
                  <p className="text-xs text-museum-500 mt-1">
                    Provide context to help generate authentic dialogue
                  </p>
                </div>
                
                {/* Motion Style Selection */}
                <div>
                  <label className="block text-sm font-medium text-museum-700 mb-3">
                    Animation Style
                  </label>
                  <div className="space-y-3">
                    {motionStyles.map((style) => (
                      <label
                        key={style.id}
                        className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                          motionStyle === style.id
                            ? 'border-gold-400 bg-gold-50'
                            : 'border-museum-200 hover:border-museum-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="motionStyle"
                          value={style.id}
                          checked={motionStyle === style.id}
                          onChange={(e) => setMotionStyle(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-start space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                            motionStyle === style.id
                              ? 'border-gold-500 bg-gold-500'
                              : 'border-museum-300'
                          }`}>
                            {motionStyle === style.id && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-museum-900">{style.name}</div>
                            <div className="text-sm text-museum-600">{style.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!capturedImage || !context.trim() || isProcessing}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    !capturedImage || !context.trim() || isProcessing
                      ? 'bg-museum-300 text-museum-500 cursor-not-allowed'
                      : 'bg-gold-600 hover:bg-gold-700 text-white transform hover:scale-105'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Animation...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Animate Portrait</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="mt-12 card bg-museum-100">
            <h3 className="text-lg font-serif font-semibold text-museum-900 mb-4">
              Tips for Best Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-museum-700">
              <div>
                <h4 className="font-medium mb-2">Image Quality</h4>
                <ul className="space-y-1 text-museum-600">
                  <li>• Use high-resolution images when possible</li>
                  <li>• Ensure the face is clearly visible</li>
                  <li>• Good lighting improves animation quality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Context</h4>
                <ul className="space-y-1 text-museum-600">
                  <li>• Include historical period and significance</li>
                  <li>• Mention the subject's role or profession</li>
                  <li>• Add interesting facts or stories</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}