export class AnimationManager {
  constructor(options = {}) {
    this.options = {
      threshold: options.threshold || 0.2,
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      animationClass: options.animationClass || 'anim-1'
    };
    
    this.observer = null;
    this.observedElements = new Set();
    this.init();
  }

  init() {
    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: this.options.threshold,
        root: this.options.root,
        rootMargin: this.options.rootMargin
      }
    );
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Add animation class
        element.classList.add(this.options.animationClass);
        
        // Optional: Stop observing after animation
        if (!element.hasAttribute('data-repeat-animation')) {
          this.observer.unobserve(element);
          this.observedElements.delete(element);
        }
      } else if (element.hasAttribute('data-repeat-animation')) {
        // Reset animation if repeat is enabled
        element.classList.remove(this.options.animationClass);
      }
    });
  }

  observe(elements) {
    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    elements.forEach(element => {
      if (element && !this.observedElements.has(element)) {
        // Add pre-animation class
        element.classList.add('pre-animation', 'will-animate');
        
        // Start observing
        this.observer.observe(element);
        this.observedElements.add(element);
      }
    });
  }

  unobserve(elements) {
    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    elements.forEach(element => {
      if (element && this.observedElements.has(element)) {
        this.observer.unobserve(element);
        this.observedElements.delete(element);
        
        // Clean up classes
        element.classList.remove('pre-animation', 'will-animate');
      }
    });
  }

  // Helper method to apply different animation variations
  setAnimation(elements, animationClass) {
    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    elements.forEach(element => {
      // Remove any existing animation classes
      element.classList.remove('anim-1', 'anim-2', 'anim-3', 'anim-4', 'anim-5', 'anim-6');
      
      // Update the animation class
      this.options.animationClass = animationClass;
      
      // If already being observed, trigger re-animation
      if (this.observedElements.has(element)) {
        element.classList.remove(animationClass);
        element.classList.add('pre-animation');
        
        // Force reflow
        void element.offsetWidth;
        
        // Re-add animation class
        element.classList.add(animationClass);
      }
    });
  }
}

// Usage example:
// const animManager = new AnimationManager({
//   threshold: 0.2,
//   rootMargin: '50px',
//   animationClass: 'anim-1'
// });
//
// // Observe elements
// animManager.observe(document.querySelectorAll('.animate-me'));
//
// // Change animation style
// animManager.setAnimation(element, 'anim-2');