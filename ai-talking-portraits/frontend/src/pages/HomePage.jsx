import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, Sparkles, Users, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="museum-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-serif font-bold text-museum-900 mb-6 text-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Bring Portraits to Life
            </motion.h1>
            
            <motion.p 
              className="text-xl text-museum-700 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform static portraits into engaging, speaking characters with AI-powered animation. 
              Perfect for museums, galleries, and educational experiences.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/capture"
                className="inline-flex items-center space-x-2 bg-gold-600 hover:bg-gold-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Camera className="w-5 h-5" />
                <span>Create Your Talking Portrait</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-museum-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-museum-600 max-w-2xl mx-auto">
              Our AI technology transforms any portrait into a lifelike, speaking character in just minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-museum-900 mb-4">
                Capture or Upload
              </h3>
              <p className="text-museum-600 leading-relaxed">
                Take a photo of any portrait or upload an existing image. 
                Our system works with paintings, photographs, and historical artwork.
              </p>
            </motion.div>
            
            <motion.div 
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-museum-900 mb-4">
                AI Animation
              </h3>
              <p className="text-museum-600 leading-relaxed">
                Our AI generates natural movement, contextual dialogue, and synchronized lip movements 
                to bring the portrait to life.
              </p>
            </motion.div>
            
            <motion.div 
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-museum-900 mb-4">
                Engage Visitors
              </h3>
              <p className="text-museum-600 leading-relaxed">
                Share your talking portrait with visitors, students, or online audiences. 
                Create memorable educational experiences.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-museum-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-serif font-bold text-gold-600 mb-2">
                <Clock className="w-8 h-8 inline-block mr-2" />
                60s
              </div>
              <p className="text-museum-700 font-medium">Average Processing Time</p>
            </div>
            
            <div>
              <div className="text-4xl font-serif font-bold text-gold-600 mb-2">
                <Sparkles className="w-8 h-8 inline-block mr-2" />
                AI
              </div>
              <p className="text-museum-700 font-medium">Powered Animation</p>
            </div>
            
            <div>
              <div className="text-4xl font-serif font-bold text-gold-600 mb-2">
                <Users className="w-8 h-8 inline-block mr-2" />
                Museums
              </div>
              <p className="text-museum-700 font-medium">Ready Integration</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-museum-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">
            Ready to Bring History to Life?
          </h2>
          <p className="text-xl text-museum-300 mb-8 leading-relaxed">
            Start creating your own talking portraits today. Perfect for museums, 
            educational institutions, and cultural experiences.
          </p>
          <Link
            to="/capture"
            className="inline-flex items-center space-x-2 bg-gold-600 hover:bg-gold-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <Camera className="w-5 h-5" />
            <span>Get Started Now</span>
          </Link>
        </div>
      </section>
    </div>
  )
}