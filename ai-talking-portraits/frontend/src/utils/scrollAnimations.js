/**
 * Simple scroll animation utility
 * Adds scroll-triggered animations without heavy dependencies
 * Optimized for mobile performance
 */

// Initialize scroll animations when DOM is loaded
export const initScrollAnimations = () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Skip animations if user prefers reduced motion
    return;
  }

  // Detect mobile devices for optimized settings
  const isMobile = window.innerWidth <= 768;
  const staggerDelay = isMobile ? 100 : 150;
  const threshold = isMobile ? 0.05 : 0.1;
  const rootMargin = isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px';

  // DEBUG: Log which background should be used
  console.log('🖼️ Background Debug Info:');
  console.log('Screen width:', window.innerWidth);
  console.log('Is mobile (≤768px):', isMobile);
  console.log('Expected background:', isMobile ? 'background_mobile.png' : 'background.png');
  console.log('User agent:', navigator.userAgent);
  
  // Check if mobile media query matches
  const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
  console.log('Mobile media query matches:', mobileMediaQuery.matches);

  // Create intersection observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation classes when element comes into view
          entry.target.classList.add('animate-in');
          
          // Add staggered animation delays for child elements
          const staggeredElements = entry.target.querySelectorAll('[data-stagger]');
          staggeredElements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('animate-in');
            }, index * staggerDelay);
          });
        }
      });
    },
    {
      threshold: threshold,
      rootMargin: rootMargin
    }
  );

  // Observe all elements with scroll animation classes
  const animatedElements = document.querySelectorAll(
    '.scroll-fade-up, .scroll-fade-left, .scroll-fade-right, .scroll-scale, .scroll-slide-up, .scroll-rotate-in, .scroll-zoom-in, .scroll-flip-in'
  );
  
  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  // Add parallax effect to elements with data-parallax (disabled on mobile for performance)
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length > 0 && !isMobile) {
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    };

    const requestParallaxUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  }

  // Handle orientation changes on mobile
  if (isMobile) {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        // Re-trigger animations after orientation change
        const animatedElements = document.querySelectorAll('.animate-in');
        animatedElements.forEach(el => {
          el.classList.remove('animate-in');
          setTimeout(() => {
            if (isElementInViewport(el)) {
              el.classList.add('animate-in');
            }
          }, 100);
        });
      }, 500);
    });
  }
};

// Helper function to check if element is in viewport
const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }
}