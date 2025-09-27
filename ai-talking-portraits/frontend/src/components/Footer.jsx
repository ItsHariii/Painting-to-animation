import React from 'react'

export function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-catchy font-bold mb-6 text-white">
              About Talking Portraits
            </h3>
            <p className="text-primary-200 text-base leading-relaxed font-catchy">
              Bringing historical portraits to life through AI-powered animation and contextual dialogue. 
              Experience history in a new way as portraits speak directly to museum visitors.
            </p>
          </div>
          
          {/* Technology */}
          <div className="space-y-4">
            <h3 className="text-2xl font-catchy font-bold mb-6 text-white">
              Technology
            </h3>
            <ul className="text-primary-200 text-base space-y-3 font-catchy">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-400 rounded-full mr-3"></span>
                AI Motion Transfer (FOMM)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-400 rounded-full mr-3"></span>
                Lip Synchronization (Wav2Lip)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-400 rounded-full mr-3"></span>
                OpenAI Script Generation
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-400 rounded-full mr-3"></span>
                Real-time Processing
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-2xl font-catchy font-bold mb-6 text-white">
              Museum Integration
            </h3>
            <p className="text-primary-200 text-base leading-relaxed font-catchy mb-6">
              Designed for museums, galleries, and cultural institutions. 
              Contact us to learn about custom installations and educational programs.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white font-catchy font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Get In Touch
            </button>
          </div>
        </div>
        
        <div className="border-t border-primary-700 mt-12 pt-8 text-center">
          <p className="text-primary-300 text-base font-catchy">
            © 2024 AI Talking Portraits. Bringing history to life through technology.
          </p>
        </div>
      </div>
    </footer>
  )
}