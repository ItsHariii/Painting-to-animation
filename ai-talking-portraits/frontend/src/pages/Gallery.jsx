import React, { useState, useEffect } from 'react'
import { Play, Clock, User } from 'lucide-react'
import { motion } from 'framer-motion'

export function Gallery() {
  const [portraits, setPortraits] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // TODO: Fetch gallery data from API
    const mockPortraits = [
      {
        id: '1',
        title: 'Leonardo da Vinci',
        period: 'Renaissance (1452-1519)',
        thumbnail: '/api/placeholder/300/400',
        video_url: '/mock-video-1.mp4',
        duration: 25,
        created_at: '2024-01-15T10:30:00Z',
        description: 'The master artist and inventor speaks about his creative process and scientific discoveries.'
      },
      {
        id: '2',
        title: 'Marie Curie',
        period: 'Modern Era (1867-1934)',
        thumbnail: '/api/placeholder/300/400',
        video_url: '/mock-video-2.mp4',
        duration: 30,
        created_at: '2024-01-14T15:45:00Z',
        description: 'The pioneering scientist discusses her groundbreaking research in radioactivity.'
      },
      {
        id: '3',
        title: 'Napoleon Bonaparte',
        period: 'Napoleonic Era (1769-1821)',
        thumbnail: '/api/placeholder/300/400',
        video_url: '/mock-video-3.mp4',
        duration: 28,
        created_at: '2024-01-13T09:20:00Z',
        description: 'The French emperor reflects on his military campaigns and political reforms.'
      },
      {
        id: '4',
        title: 'Cleopatra VII',
        period: 'Ancient Egypt (69-30 BCE)',
        thumbnail: '/api/placeholder/300/400',
        video_url: '/mock-video-4.mp4',
        duration: 22,
        created_at: '2024-01-12T14:10:00Z',
        description: 'The last pharaoh of Egypt speaks about ruling the ancient world.'
      }
    ]
    
    setTimeout(() => {
      setPortraits(mockPortraits)
      setLoading(false)
    }, 1000)
  }, [])
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-museum-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4"></div>
            <p className="text-museum-600">Loading gallery...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen py-12 bg-museum-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-museum-900 mb-4">
              Portrait Gallery
            </h1>
            <p className="text-lg text-museum-600 max-w-2xl mx-auto">
              Explore our collection of animated historical portraits. Each figure comes to life 
              with AI-generated dialogue and natural movement.
            </p>
          </div>
          
          {portraits.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-museum-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-semibold text-museum-700 mb-2">
                No Portraits Yet
              </h3>
              <p className="text-museum-600 mb-6">
                Be the first to create an animated portrait for our gallery.
              </p>
              <a
                href="/capture"
                className="btn-primary"
              >
                Create Your First Portrait
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {portraits.map((portrait, index) => (
                <motion.div
                  key={portrait.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <img
                      src={portrait.thumbnail}
                      alt={portrait.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-museum-900 ml-1" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {portrait.duration}s
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-museum-900 mb-1">
                      {portrait.title}
                    </h3>
                    <p className="text-sm text-gold-600 font-medium mb-2">
                      {portrait.period}
                    </p>
                    <p className="text-sm text-museum-600 leading-relaxed mb-3">
                      {portrait.description}
                    </p>
                    <p className="text-xs text-museum-500">
                      Created {formatDate(portrait.created_at)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Featured Section */}
          {portraits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16"
            >
              <div className="card bg-museum-900 text-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-serif font-bold mb-4">
                      Featured Portrait
                    </h2>
                    <h3 className="text-xl font-serif font-semibold text-gold-300 mb-2">
                      {portraits[0]?.title}
                    </h3>
                    <p className="text-museum-300 mb-6 leading-relaxed">
                      {portraits[0]?.description}
                    </p>
                    <button className="btn-primary">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Now
                    </button>
                  </div>
                  
                  <div className="relative">
                    <img
                      src={portraits[0]?.thumbnail}
                      alt={portraits[0]?.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}