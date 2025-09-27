/**
 * API client for AI Talking Portraits
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }
    
    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }
  
  // Health check
  async healthCheck() {
    return this.request('/')
  }
  
  // Animation endpoints
  async createAnimation(imageFile, context, motionStyle = 'gentle', duration = 20) {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('context', context)
    formData.append('motion_style', motionStyle)
    formData.append('duration', duration.toString())
    
    return this.request('/animate', {
      method: 'POST',
      body: formData,
    })
  }
  
  async getJobStatus(jobId) {
    return this.request(`/status/${jobId}`)
  }
  
  // Motion styles
  async getMotionStyles() {
    return this.request('/motions')
  }
  
  // Gallery endpoints (future implementation)
  async getGallery(page = 1, limit = 12) {
    return this.request(`/gallery?page=${page}&limit=${limit}`)
  }
  
  async getPortrait(portraitId) {
    return this.request(`/gallery/${portraitId}`)
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient()

// Export individual methods for convenience
export const {
  healthCheck,
  createAnimation,
  getJobStatus,
  getMotionStyles,
  getGallery,
  getPortrait,
} = apiClient

// Utility functions
export const validateImageFile = (file) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported. Use JPG or PNG.' }
  }
  
  return { valid: true, error: null }
}

export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
}

export const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}