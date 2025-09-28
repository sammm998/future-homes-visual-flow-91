// Aggressive image preloading utility
export const preloadImages = (imageUrls: string[]) => {
  const promises = imageUrls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Don't fail on individual image errors
      img.src = url;
    });
  });
  
  return Promise.all(promises);
};

// Force immediate image loading for visible content
export const forceImageLoading = () => {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    // Set all images to eager loading
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
    
    // If image hasn't loaded yet, force it
    if (!img.complete && img.src) {
      const newImg = new Image();
      newImg.onload = () => {
        if (img.src === newImg.src) {
          // Trigger load event
          img.dispatchEvent(new Event('load'));
        }
      };
      newImg.src = img.src;
    }
  });
};

// Preload images for the next section
export const preloadNextSectionImages = () => {
  // Get images that are just below viewport
  const images = document.querySelectorAll('img');
  const windowHeight = window.innerHeight;
  
  images.forEach((img) => {
    const rect = img.getBoundingClientRect();
    // If image is within next 500px, preload it
    if (rect.top < windowHeight + 500 && rect.top > -100) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
  });
};