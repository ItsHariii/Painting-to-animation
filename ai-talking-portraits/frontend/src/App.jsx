import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { PortraitCapture } from './pages/PortraitCapture'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link to="/" className="text-3xl font-bold text-gray-900 hover:text-gray-700">
                AI Talking Portraits
              </Link>
              <nav className="flex space-x-4">
                <Link 
                  to="/create" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Create Portrait
                </Link>
              </nav>
            </div>
          </div>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<PortraitCapture />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

// Simple home page component
function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Bring Portraits to Life with AI
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Transform static portrait images into animated talking videos using advanced AI technology. 
        Perfect for museums, education, and bringing history to life.
      </p>
      <div className="space-y-4">
        <Link 
          to="/create"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
        >
          🎬 Create Your First Talking Portrait
        </Link>
        <div className="text-sm text-gray-500">
          Upload an image or use your camera to get started
        </div>
      </div>
      
      {/* Feature highlights */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">📷</div>
          <h3 className="text-lg font-semibold mb-2">Easy Capture</h3>
          <p className="text-gray-600">Use your camera or upload existing images</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
          <p className="text-gray-600">Advanced AI generates contextual dialogue and animation</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">🎭</div>
          <h3 className="text-lg font-semibold mb-2">Lifelike Animation</h3>
          <p className="text-gray-600">Realistic facial animation and lip synchronization</p>
        </div>
      </div>
    </div>
  )
}

export default App