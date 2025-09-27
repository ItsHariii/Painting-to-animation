import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Camera, Gallery, Home } from 'lucide-react'

export function Header() {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  
  return (
    <header className="bg-white shadow-sm border-b border-museum-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-serif font-semibold text-museum-900">
              Talking Portraits
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-gold-100 text-gold-800' 
                  : 'text-museum-600 hover:text-museum-900 hover:bg-museum-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/capture"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/capture') 
                  ? 'bg-gold-100 text-gold-800' 
                  : 'text-museum-600 hover:text-museum-900 hover:bg-museum-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Create</span>
            </Link>
            
            <Link
              to="/gallery"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/gallery') 
                  ? 'bg-gold-100 text-gold-800' 
                  : 'text-museum-600 hover:text-museum-900 hover:bg-museum-100'
              }`}
            >
              <Gallery className="w-4 h-4" />
              <span>Gallery</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}