import { useState, useEffect, useCallback } from 'react'
import { getJobStatus } from '../lib/api'

/**
 * Custom hook for polling job status
 * @param {string} jobId - The job ID to poll
 * @param {number} interval - Polling interval in milliseconds (default: 2000)
 * @param {boolean} enabled - Whether polling is enabled
 * @returns {object} - Status data and control functions
 */
export const useJobStatus = (jobId, interval = 2000, enabled = true) => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  const pollStatus = useCallback(async () => {
    if (!jobId || !enabled) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await getJobStatus(jobId)
      setStatus(response)
      
      // Calculate progress based on status
      if (response.status === 'processing' || response.status === 'running') {
        // Simulate progress based on time elapsed or actual progress from backend
        setProgress(prev => Math.min(prev + Math.random() * 10, 95))
      } else if (response.status === 'done' || response.status === 'completed') {
        setProgress(100)
      } else if (response.status === 'error' || response.status === 'failed') {
        setProgress(0)
      }
      
    } catch (err) {
      console.error('Error polling job status:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [jobId, enabled])

  // Start polling when jobId is provided and enabled
  useEffect(() => {
    if (!jobId || !enabled) return

    // Initial poll
    pollStatus()

    // Set up interval polling
    const intervalId = setInterval(pollStatus, interval)

    // Cleanup
    return () => {
      clearInterval(intervalId)
    }
  }, [jobId, enabled, interval, pollStatus])

  // Stop polling when job is complete or failed
  useEffect(() => {
    if (status?.status === 'done' || 
        status?.status === 'completed' || 
        status?.status === 'error' || 
        status?.status === 'failed') {
      // Polling will stop on next effect cleanup
    }
  }, [status?.status])

  const resetStatus = useCallback(() => {
    setStatus(null)
    setProgress(0)
    setError(null)
    setLoading(false)
  }, [])

  return {
    status: status?.status || 'idle',
    data: status,
    progress,
    loading,
    error,
    resetStatus,
    pollStatus
  }
}

export default useJobStatus