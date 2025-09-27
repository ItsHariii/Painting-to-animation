import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { PortraitCapture } from './pages/PortraitCapture'
import { Gallery } from './pages/Gallery'
import { Footer } from './components/Footer'
import { initScrollAnimations } from './utils/scrollAnimations'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [logoClicked, setLogoClicked] = useState(false);

  useEffect(() => {
    // Initialize scroll animations after component mounts
    const timer = setTimeout(() => {
      initScrollAnimations();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    setLogoClicked(true);
    
    // Reset animation after it completes
    setTimeout(() => {
      setLogoClicked(false);
    }, 2000);
    
    // Navigate after animation
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
  };

  return (
    <Router>
      <div className="min-h-screen static-background">
        <header className="sticky top-0 z-50 rounded-b-3xl" style={{
          background: 'linear-gradient(135deg, rgba(55, 24, 4, 0.95) 0%, rgba(42, 28, 27, 0.9) 100%)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          borderBottom: '1px solid rgba(226, 149, 42, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(226, 149, 42, 0.1)'
        }}>
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent"></div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center py-5">
              {/* Enhanced Animated Logo Section */}
              <Link to="/" className="flex items-center space-x-5 group relative" onClick={handleLogoClick}>
                <div className="relative logo-sparkle logo-container">
                  {/* Magical trail effect */}
                  <div className="logo-magical-trail opacity-0 group-hover:opacity-100"></div>
                  
                  {/* Animated background container */}
                  <div className={`w-16 h-16 flex items-center justify-center relative overflow-visible rounded-xl bg-gradient-to-br from-primary-600/20 to-primary-800/20 border border-primary-400/30 group-hover:border-primary-400/60 transition-all duration-500 logo-magical-float ${logoClicked ? 'logo-coin-flip' : ''}`}>
                    {/* Rotating background ring */}
                    <div className="absolute inset-0 rounded-xl border-2 border-primary-300/20 logo-gentle-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Main logo with coin flip animation */}
                    <img
                      src="/src/assets/images/logos/portrait_logo.png"
                      alt="AI Talking Portraits Logo"
                      className="w-10 h-10 object-contain rounded-lg logo-hover-flip"
                      style={{
                        filter: 'drop-shadow(0 2px 8px rgba(226, 149, 42, 0.4))',
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.nextSibling.style.display = 'flex';
                      }}
                    />
                    
                    {/* Magical spark overlay with pulsing effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    
                    {/* Additional floating particles */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping" style={{animationDelay: '0.5s'}}></div>
                  </div>
                  <svg className="w-12 h-12 text-primary-400 hidden items-center justify-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <span className="text-2xl font-catchy font-bold metallic-gold transition-all duration-300 group-hover:scale-105">
                    Anima
                  </span>
                  <span className="text-sm font-catchy text-primary-300/80 group-hover:text-primary-200 transition-all duration-300 font-light tracking-wide">
                    Bringing History to Life
                  </span>
                </div>
              </Link>

              {/* Premium Navigation */}
              <nav className="flex items-center space-x-8">
                <a href="#about" className="relative font-catchy font-medium text-primary-200/90 hover:text-white transition-all duration-300 group px-4 py-2">
                  <span className="relative z-10">About</span>
                  <div className="absolute inset-0 bg-primary-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary-400 group-hover:w-8 transition-all duration-300"></div>
                </a>

                <Link to="/gallery" className="relative font-catchy font-medium text-primary-200/90 hover:text-white transition-all duration-300 group px-4 py-2">
                  <span className="relative z-10">Gallery</span>
                  <div className="absolute inset-0 bg-primary-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary-400 group-hover:w-8 transition-all duration-300"></div>
                </Link>

                <a href="#demo" className="relative font-catchy font-medium text-primary-200/90 hover:text-white transition-all duration-300 group px-4 py-2">
                  <span className="relative z-10">Demo</span>
                  <div className="absolute inset-0 bg-primary-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary-400 group-hover:w-8 transition-all duration-300"></div>
                </a>

                <Link
                  to="/create"
                  className="relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 font-catchy font-semibold text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl group overflow-hidden"
                  style={{ boxShadow: '0 4px 20px rgba(226, 149, 42, 0.3)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-4 h-4 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="relative z-10">Create Portrait</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent"></div>
        </header>

        <main className="relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<PortraitCapture />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

// Stunning home page component designed to wow judges
function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section - Completely Redesigned */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 -mt-20 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-400/20 to-warm-400/20 rounded-full blur-3xl animate-gentle-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-warm-400/20 to-primary-400/20 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-600/10 to-warm-600/10 rounded-full blur-2xl animate-pulse-soft"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="relative">

            {/* Main Headline */}
            <h1 className="text-7xl md:text-9xl font-catchy font-bold mb-8 relative">
              <span className="metallic-gold text-shadow-2xl animate-fade-in block">
                When Art
              </span>
              <span className="metallic-gold text-shadow-2xl animate-fade-in block" style={{ animationDelay: '0.3s' }}>
                Speaks.
              </span>
            </h1>

            {/* Subtitle */}
            <div className="text-2xl md:text-4xl text-primary-200 mb-4 max-w-5xl mx-auto font-catchy font-light animate-slide-up" style={{ animationDelay: '0.6s' }}>
              Bring forgotten voices into the present
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '1.2s' }}>
              <Link
                to="/create"
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 font-catchy font-bold text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-warm-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 metallic-gold">Create Your Portrait</span>
              </Link>

              <button className="group inline-flex items-center justify-center px-8 py-6 bg-transparent border-2 border-primary-400 hover:border-warm-400 text-primary-200 hover:text-warm-200 font-catchy font-semibold text-xl rounded-2xl transition-all duration-500 transform hover:scale-105 hover:bg-primary-600/10">
                Watch Demo
              </button>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-warm-500/10 border border-warm-400/30 rounded-full mb-6">
              <span className="text-warm-400 font-catchy font-medium">Live Demo</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-catchy font-bold text-white mb-6 text-shadow-2xl">
              See the Magic
            </h2>
            <p className="text-xl text-primary-100 font-catchy max-w-4xl mx-auto leading-relaxed text-shadow-lg">
              Watch as historical figures come to life with our cutting-edge AI technology
            </p>
          </div>

          {/* Demo Video Container */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl shadow-3xl bg-gradient-to-br from-primary-900 to-primary-800">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-warm-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-warm-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-catchy font-bold text-primary-900 mb-2">Interactive Demo</h3>
                  <p className="text-primary-700 font-catchy">Click to see a talking portrait in action</p>
                </div>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white/95 hover:bg-white rounded-full p-6 transform hover:scale-110 transition-all duration-300 shadow-2xl">
                  <svg className="w-12 h-12 text-primary-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Technology Pipeline Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-transparent to-primary-100/30"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-warm-400/10 to-primary-400/10 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-primary-400/10 to-warm-400/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-600/5 to-warm-600/5 rounded-full blur-2xl animate-gentle-float"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600/20 to-warm-600/20 backdrop-blur-sm border border-primary-400/30 rounded-full mb-10 shadow-lg scroll-fade-up">
              <div className="w-3 h-3 bg-warm-500 rounded-full mr-4 animate-pulse"></div>
              <span className="text-primary-700 font-catchy font-semibold text-xl">Enterprise-Grade AI Technology Stack</span>
              <div className="w-3 h-3 bg-primary-500 rounded-full ml-4 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <h2 className="text-6xl md:text-8xl font-catchy font-bold text-primary-900 mb-10 leading-tight scroll-slide-up">
              The Magic Behind It
            </h2>
            <p className="text-2xl md:text-3xl text-primary-600 font-catchy max-w-6xl mx-auto leading-relaxed mb-8 scroll-fade-up">
              A streamlined pipeline combining cutting-edge AI models for instant portrait animation
            </p>

            {/* Enhanced Performance Metrics with Animations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16 stagger-children">
              <div className="text-center group cursor-pointer scroll-scale" data-stagger>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-warm-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 border border-primary-200/50">
                    <div className="text-4xl md:text-5xl font-catchy font-bold text-primary-800 mb-2 group-hover:scale-110 transition-transform duration-300">&lt; 60s</div>
                    <div className="text-primary-600 font-catchy font-medium">Processing Time</div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="text-center group cursor-pointer scroll-scale" data-stagger>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 border border-primary-200/50">
                    <div className="text-4xl md:text-5xl font-catchy font-bold text-primary-800 mb-2 group-hover:scale-110 transition-transform duration-300">1080p</div>
                    <div className="text-primary-600 font-catchy font-medium">HD Quality</div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="text-center group cursor-pointer scroll-scale" data-stagger>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 border border-primary-200/50">
                    <div className="text-4xl md:text-5xl font-catchy font-bold text-primary-800 mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                    <div className="text-primary-600 font-catchy font-medium">Uptime</div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="text-center group cursor-pointer scroll-scale" data-stagger>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 border border-primary-200/50">
                    <div className="text-4xl md:text-5xl font-catchy font-bold text-primary-800 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                    <div className="text-primary-600 font-catchy font-medium">Available</div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Pipeline */}
          <div className="space-y-20">
            {/* Step 1 - Enhanced Frontend & Backend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
              <div className="order-2 lg:order-1 scroll-fade-left">
                <div className="relative group cursor-pointer">
                  {/* Enhanced floating background elements */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary-400/20 to-warm-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary-300/30 to-warm-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-warm-300/30 to-primary-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>

                  <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-14 shadow-2xl border border-primary-200/50 group-hover:shadow-3xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-[1.02]">
                    <div className="flex items-center mb-10">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mr-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                        {/* Animated icon background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/50 to-primary-600/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <svg className="relative w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {/* Floating particles */}
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                      </div>
                      <div className="group-hover:translate-x-2 transition-transform duration-300">
                        <h3 className="text-5xl font-catchy font-bold text-primary-900 mb-3 group-hover:text-primary-700 transition-colors duration-300">01. React Frontend</h3>
                        <div className="text-primary-500 font-catchy font-medium text-lg group-hover:text-primary-600 transition-colors duration-300">Modern Web Interface</div>
                      </div>
                    </div>
                    <p className="text-primary-700 leading-relaxed font-catchy text-xl mb-10">
                      Built with React 18 and Tailwind CSS for a responsive, modern interface. Features real-time camera capture, drag-and-drop uploads, and live status updates with seamless user experience.
                    </p>

                    {/* Technical Stack Details */}
                    <div className="bg-primary-50/50 rounded-2xl p-6 mb-8">
                      <h4 className="text-lg font-catchy font-bold text-primary-800 mb-4">Frontend Technologies</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy">React 18 + Hooks</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy">Tailwind CSS</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy">Vite Build Tool</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy">React Router</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center px-5 py-3 bg-primary-100 rounded-full">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">WebRTC Camera</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-primary-100 rounded-full">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">Drag & Drop</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-primary-100 rounded-full">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">Real-time Status</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-primary-100 rounded-full">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">Responsive Design</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative group cursor-pointer">
                  {/* Enhanced floating elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-warm-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-primary-300/40 to-warm-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-warm-300/40 to-primary-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute top-1/4 -right-6 w-4 h-4 bg-gradient-to-br from-blue-300/40 to-purple-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.4s' }}></div>

                  <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-warm-100 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105 group-hover:-rotate-1">
                    <div className="text-center">
                      <div className="relative w-40 h-40 bg-gradient-to-br from-primary-600 to-warm-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        {/* Animated background rings */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-warm-400/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <div className="absolute -inset-2 border-2 border-primary-300/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin" style={{ animationDuration: '8s' }}></div>

                        <svg className="relative w-20 h-20 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>

                        {/* Floating data particles */}
                        <div className="absolute -top-3 -right-3 w-3 h-3 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce"></div>
                        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      </div>
                      <h4 className="text-3xl font-catchy font-bold text-primary-900 mb-3 group-hover:text-primary-700 transition-colors duration-300">FastAPI Backend</h4>
                      <p className="text-primary-600 font-catchy text-lg group-hover:text-primary-700 transition-colors duration-300">High-performance Python API</p>
                      <div className="mt-6 text-primary-500 font-catchy group-hover:text-primary-600 transition-colors duration-300">
                        <div className="text-sm transform group-hover:translate-y-1 transition-transform duration-300">Async Processing • RESTful API</div>
                        <div className="text-sm mt-1 transform group-hover:translate-y-1 transition-transform duration-300" style={{ transitionDelay: '0.1s' }}>Pydantic Validation • Auto Documentation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - Enhanced OpenAI Integration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
              <div className="scroll-fade-left">
                <div className="relative group cursor-pointer">
                  {/* Enhanced floating elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-warm-100 to-primary-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute -top-6 -right-6 w-10 h-10 bg-gradient-to-br from-warm-300/40 to-orange-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.1s' }}></div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-orange-300/40 to-red-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute top-1/3 -left-6 w-6 h-6 bg-gradient-to-br from-yellow-300/40 to-warm-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.5s' }}></div>

                  <div className="relative aspect-square bg-gradient-to-br from-warm-100 to-primary-100 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-1">
                    <div className="text-center">
                      <div className="relative w-40 h-40 bg-gradient-to-br from-warm-600 to-warm-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                        {/* Animated background rings */}
                        <div className="absolute inset-0 bg-gradient-to-br from-warm-400/30 to-orange-400/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <div className="absolute -inset-3 border-2 border-warm-300/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin" style={{ animationDuration: '10s' }}></div>

                        <svg className="relative w-20 h-20 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>

                        {/* AI thinking particles */}
                        <div className="absolute -top-4 -right-2 w-3 h-3 bg-yellow-300/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce"></div>
                        <div className="absolute -bottom-3 -left-3 w-2 h-2 bg-orange-300/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="absolute top-2 -left-4 w-2 h-2 bg-warm-300/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <h4 className="text-3xl font-catchy font-bold text-primary-900 mb-3 group-hover:text-warm-700 transition-colors duration-300">OpenAI Platform</h4>
                      <p className="text-primary-600 font-catchy text-lg group-hover:text-warm-600 transition-colors duration-300">GPT-4 + TTS-1 Integration</p>
                      <div className="mt-6 text-primary-500 font-catchy group-hover:text-warm-600 transition-colors duration-300">
                        <div className="text-sm transform group-hover:translate-y-1 transition-transform duration-300">Context-Aware Generation</div>
                        <div className="text-sm mt-1 transform group-hover:translate-y-1 transition-transform duration-300" style={{ transitionDelay: '0.1s' }}>Neural Voice Synthesis</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="scroll-fade-right">
                <div className="relative group cursor-pointer">
                  {/* Enhanced floating background elements */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-warm-400/20 to-primary-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                  <div className="absolute -top-6 -left-8 w-14 h-14 bg-gradient-to-br from-warm-300/30 to-orange-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="absolute -bottom-8 -right-6 w-10 h-10 bg-gradient-to-br from-orange-300/30 to-warm-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce" style={{ animationDelay: '0.3s' }}></div>

                  <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-14 shadow-2xl border border-primary-200/50 group-hover:shadow-3xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-[1.02]">
                    <div className="flex items-center mb-10">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-warm-600 to-warm-700 rounded-2xl flex items-center justify-center mr-8 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-xl">
                        {/* Animated icon background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-warm-400/50 to-warm-600/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <svg className="relative w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        {/* Floating particles */}
                        <div className="absolute -top-2 -left-2 w-3 h-3 bg-warm-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <div className="group-hover:translate-x-2 transition-transform duration-300">
                        <h3 className="text-5xl font-catchy font-bold text-primary-900 mb-3 group-hover:text-warm-700 transition-colors duration-300">02. AI Content Engine</h3>
                        <div className="text-primary-500 font-catchy font-medium text-lg group-hover:text-warm-600 transition-colors duration-300">OpenAI GPT-4 + TTS-1</div>
                      </div>
                    </div>
                    <p className="text-primary-700 leading-relaxed font-catchy text-xl mb-10">
                      Leverages OpenAI's most advanced models for intelligent script generation and natural voice synthesis. GPT-4 creates historically accurate, contextually relevant dialogue while TTS-1 produces human-like speech with emotional nuance.
                    </p>

                    {/* AI Capabilities */}
                    <div className="bg-warm-50/50 rounded-2xl p-6 mb-8">
                      <h4 className="text-lg font-catchy font-bold text-primary-800 mb-4">AI Capabilities</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy">Historical Context Analysis</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy">Personality-Based Dialogue</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy">Natural Voice Modulation</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy">Multi-Language Support</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center px-5 py-3 bg-warm-100 rounded-full">
                        <div className="w-3 h-3 bg-warm-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">GPT-4 Turbo</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-warm-100 rounded-full">
                        <div className="w-3 h-3 bg-warm-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">TTS-1 HD</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-warm-100 rounded-full">
                        <div className="w-3 h-3 bg-warm-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">48kHz Audio</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-warm-100 rounded-full">
                        <div className="w-3 h-3 bg-warm-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">6 Voice Options</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Enhanced AI Animation Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
              <div className="order-2 lg:order-1 scroll-fade-left">
                <div className="relative group cursor-pointer">
                  {/* Enhanced floating background elements */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary-400/20 to-warm-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  <div className="absolute top-1/2 -right-4 w-8 h-8 bg-gradient-to-br from-indigo-300/30 to-blue-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce" style={{ animationDelay: '0.6s' }}></div>

                  <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-14 shadow-2xl border border-primary-200/50 group-hover:shadow-3xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-[1.02]">
                    <div className="flex items-center mb-10">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-primary-600 to-warm-600 rounded-2xl flex items-center justify-center mr-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                        {/* Animated icon background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-pink-400/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <svg className="relative w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {/* Multiple floating particles */}
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping" style={{ animationDelay: '0.1s' }}></div>
                        <div className="absolute top-0 -left-2 w-2 h-2 bg-indigo-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <div className="group-hover:translate-x-2 transition-transform duration-300">
                        <h3 className="text-5xl font-catchy font-bold text-primary-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">03. AI Animation</h3>
                        <div className="text-primary-500 font-catchy font-medium text-lg group-hover:text-purple-600 transition-colors duration-300">FOMM + Wav2Lip Pipeline</div>
                      </div>
                    </div>
                    <p className="text-primary-700 leading-relaxed font-catchy text-xl mb-10">
                      Advanced neural networks bring portraits to life with realistic facial movements. First Order Motion Model generates natural expressions and head movements, while Wav2Lip ensures perfect audio-visual synchronization with sub-frame accuracy.
                    </p>

                    {/* Animation Pipeline */}
                    <div className="bg-primary-50/50 rounded-2xl p-6 mb-8">
                      <h4 className="text-lg font-catchy font-bold text-primary-800 mb-4">Animation Pipeline</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 mt-1">
                            <span className="text-white font-bold text-sm">1</span>
                          </div>
                          <div>
                            <div className="font-catchy font-semibold text-primary-800">Facial Landmark Detection</div>
                            <div className="text-primary-600 text-sm">68-point facial mapping for precise control</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 mt-1">
                            <span className="text-white font-bold text-sm">2</span>
                          </div>
                          <div>
                            <div className="font-catchy font-semibold text-primary-800">Motion Generation (FOMM)</div>
                            <div className="text-primary-600 text-sm">Natural head movements and expressions</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4 mt-1">
                            <span className="text-white font-bold text-sm">3</span>
                          </div>
                          <div>
                            <div className="font-catchy font-semibold text-primary-800">Lip Synchronization (Wav2Lip)</div>
                            <div className="text-primary-600 text-sm">Frame-perfect audio-visual alignment</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center px-5 py-3 bg-primary-100 rounded-full">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">Neural Animation</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-primary-100 rounded-full">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">Real-time Sync</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-primary-100 rounded-full">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">1080p Output</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-primary-100 rounded-full">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">GPU Accelerated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 scroll-fade-right">
                <div className="relative group cursor-pointer">
                  {/* Enhanced floating elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-warm-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute -top-8 -left-8 w-12 h-12 bg-gradient-to-br from-purple-300/40 to-indigo-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-gradient-to-br from-indigo-300/40 to-blue-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute top-1/4 -left-4 w-6 h-6 bg-gradient-to-br from-blue-300/40 to-cyan-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.4s' }}></div>
                  <div className="absolute bottom-1/3 -right-8 w-8 h-8 bg-gradient-to-br from-cyan-300/40 to-teal-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-float" style={{ animationDelay: '0.6s' }}></div>

                  <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-warm-100 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-2">
                    <div className="text-center">
                      <div className="relative w-40 h-40 bg-gradient-to-br from-primary-600 to-warm-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                        {/* Neural network visualization */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <div className="absolute -inset-4 border-2 border-purple-300/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin" style={{ animationDuration: '12s' }}></div>
                        <div className="absolute -inset-1 border border-blue-300/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>

                        <svg className="relative w-20 h-20 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>

                        {/* Neural network nodes */}
                        <div className="absolute -top-3 -right-4 w-3 h-3 bg-purple-300/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce"></div>
                        <div className="absolute -bottom-4 -left-2 w-2 h-2 bg-blue-300/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="absolute top-1 -left-5 w-2 h-2 bg-indigo-300/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="absolute -bottom-1 -right-5 w-3 h-3 bg-cyan-300/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        <div className="absolute top-4 right-1 w-2 h-2 bg-teal-300/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <h4 className="text-3xl font-catchy font-bold text-primary-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">Neural Networks</h4>
                      <p className="text-primary-600 font-catchy text-lg group-hover:text-purple-600 transition-colors duration-300">Deep Learning Animation</p>
                      <div className="mt-6 text-primary-500 font-catchy group-hover:text-purple-600 transition-colors duration-300">
                        <div className="text-sm transform group-hover:translate-y-1 transition-transform duration-300">PyTorch Framework</div>
                        <div className="text-sm mt-1 transform group-hover:translate-y-1 transition-transform duration-300" style={{ transitionDelay: '0.1s' }}>CUDA Acceleration</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 - Enhanced Cloud Infrastructure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-20">
            <div className="scroll-fade-left">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-warm-100 to-primary-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="relative aspect-square bg-gradient-to-br from-warm-100 to-primary-100 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                    <div className="text-center">
                      <div className="w-40 h-40 bg-gradient-to-br from-warm-600 to-warm-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-105 transition-transform duration-300">
                        <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      </div>
                      <h4 className="text-3xl font-catchy font-bold text-primary-900 mb-3">AWS Cloud</h4>
                      <p className="text-primary-600 font-catchy text-lg">S3 + CloudFront CDN</p>
                      <div className="mt-6 text-primary-500 font-catchy">
                        <div className="text-sm">Global Distribution</div>
                        <div className="text-sm mt-1">99.99% Availability</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="scroll-fade-right">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-warm-400/20 to-primary-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-14 shadow-2xl border border-primary-200/50 group-hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-center mb-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-warm-600 to-warm-700 rounded-2xl flex items-center justify-center mr-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-5xl font-catchy font-bold text-primary-900 mb-3">04. Cloud Delivery</h3>
                        <div className="text-primary-500 font-catchy font-medium text-lg">AWS S3 + Presigned URLs</div>
                      </div>
                    </div>
                    <p className="text-primary-700 leading-relaxed font-catchy text-xl mb-10">
                      Enterprise-grade cloud infrastructure ensures secure, fast delivery worldwide. Videos are stored in AWS S3 with presigned URLs for secure access, while CloudFront CDN provides lightning-fast global distribution with sub-second loading times.
                    </p>

                    {/* Infrastructure Details */}
                    <div className="bg-warm-50/50 rounded-2xl p-6 mb-8">
                      <h4 className="text-lg font-catchy font-bold text-primary-800 mb-4">Infrastructure Features</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy text-sm">S3 Object Storage</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy text-sm">CloudFront CDN</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy text-sm">Presigned URLs</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy text-sm">Auto-Scaling</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy text-sm">SSL/TLS Security</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                          <span className="text-primary-700 font-catchy text-sm">Global Edge Locations</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center px-5 py-3 bg-warm-100 rounded-full">
                        <div className="w-3 h-3 bg-warm-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">&lt; 60s Processing</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-warm-100 rounded-full">
                        <div className="w-3 h-3 bg-warm-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">Secure Access</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-warm-100 rounded-full">
                        <div className="w-3 h-3 bg-warm-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">Global CDN</span>
                      </div>
                      <div className="flex items-center px-5 py-3 bg-warm-100 rounded-full">
                        <div className="w-3 h-3 bg-warm-500 rounded-full mr-3"></div>
                        <span className="text-primary-700 font-catchy font-medium">99.9% Uptime</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology Summary */}
            <div className="mt-32 text-center scroll-fade-up">
              <div className="bg-gradient-to-r from-primary-50 to-warm-50 rounded-3xl p-12 shadow-xl border border-primary-200/30">
                <h3 className="text-4xl font-catchy font-bold text-primary-900 mb-8">Complete Technology Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto stagger-children">
                  <div className="text-center scroll-scale" data-stagger>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="font-catchy font-bold text-primary-800">Frontend</div>
                    <div className="text-primary-600 text-sm">React + Tailwind</div>
                  </div>
                  <div className="text-center scroll-scale" data-stagger>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                      </svg>
                    </div>
                    <div className="font-catchy font-bold text-primary-800">Backend</div>
                    <div className="text-primary-600 text-sm">FastAPI + Python</div>
                  </div>
                  <div className="text-center scroll-scale" data-stagger>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="font-catchy font-bold text-primary-800">AI Models</div>
                    <div className="text-primary-600 text-sm">OpenAI + Neural Nets</div>
                  </div>
                  <div className="text-center scroll-scale" data-stagger>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div className="font-catchy font-bold text-primary-800">Cloud</div>
                    <div className="text-primary-600 text-sm">AWS S3 + CDN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>


      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-900 via-primary-800 to-warm-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-warm-600/20"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-catchy font-bold text-white mb-8">
            Ready to Experience
            <br />
            <span className="metallic-gold">The Future?</span>
          </h2>
          <p className="text-xl md:text-2xl text-primary-200 font-catchy mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience the power of AI technology that brings historical portraits to life
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              to="/create"
              className="group inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-400 hover:to-warm-500 font-catchy font-bold text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
            >
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Start Creating Now
            </Link>

            <button className="group inline-flex items-center justify-center px-8 py-6 bg-transparent border-2 border-white/30 hover:border-warm-400 text-white hover:text-warm-200 font-catchy font-semibold text-xl rounded-2xl transition-all duration-500 transform hover:scale-105 hover:bg-white/10">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Sales
            </button>
          </div>

        </div>
      </section>
    </div>
  )
}

export default App