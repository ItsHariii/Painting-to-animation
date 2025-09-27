// Mobile background handler to ensure static behavior
export const initMobileBackground = () => {
  // Only run on mobile devices
  const isMobile = window.innerWidth <= 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) return;

  // Create a fixed background element
  const createFixedBackground = () => {
    // Remove any existing mobile background
    const existing = document.getElementById('mobile-bg-fixed');
    if (existing) existing.remove();

    // Create new fixed background element
    const bgElement = document.createElement('div');
    bgElement.id = 'mobile-bg-fixed';
    bgElement.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background-image: url('/src/assets/images/backgrounds/background_mobile.png') !important;
      background-size: cover !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      z-index: -9999 !important;
      pointer-events: none !important;
      transform: translate3d(0, 0, 0) !important;
    `;

    // Insert at the beginning of body
    document.body.insertBefore(bgElement, document.body.firstChild);

    // Remove background from static-background elements
    const staticBgElements = document.querySelectorAll('.static-background');
    staticBgElements.forEach(el => {
      el.style.background = 'transparent !important';
      el.style.backgroundImage = 'none !important';
    });
  };

  // Initialize immediately
  createFixedBackground();

  // Reinitialize on orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(createFixedBackground, 100);
  });

  // Reinitialize on resize (for edge cases)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(createFixedBackground, 250);
  });
};