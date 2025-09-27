import React from 'react'

export function Footer() {
  return (
    <footer className="bg-museum-900 text-museum-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">About Talking Portraits</h3>
            <p className="text-museum-300 text-sm leading-relaxed">
              Bringing historical portraits to life through AI-powered animation and contextual dialogue. 
              Experience history in a new way as portraits speak directly to museum visitors.
            </p>
          </div>
          
          {/* Technology */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">Technology</h3>
            <ul className="text-museum-300 text-sm space-y-2">
              <li>• AI Motion Transfer (FOMM)</li>
              <li>• Lip Synchronization (Wav2Lip)</li>
              <li>• OpenAI Script Generation</li>
              <li>• Real-time Processing</li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">Museum Integration</h3>
            <p className="text-museum-300 text-sm leading-relaxed">
              Designed for museums, galleries, and cultural institutions. 
              Contact us to learn about custom installations and educational programs.
            </p>
          </div>
        </div>
        
        <div className="border-t border-museum-800 mt-8 pt-6 text-center">
          <p className="text-museum-400 text-sm">
            © 2024 AI Talking Portraits. Bringing history to life through technology.
          </p>
        </div>
      </div>
    </footer>
  )
}