/**
 * Performance optimization utilities for preventing forced reflows
 * and improving rendering performance
 */

/**
 * Batch DOM reads to prevent layout thrashing
 * Use this when you need to read multiple DOM properties
 */
export function batchDOMReads<T>(callback: () => T): T {
  return requestAnimationFrame(() => callback()) as unknown as T;
}

/**
 * Batch DOM writes to prevent layout thrashing
 * Use this when you need to make multiple DOM modifications
 */
export function batchDOMWrites(callback: () => void): void {
  requestAnimationFrame(() => {
    callback();
  });
}

/**
 * Debounce function for scroll/resize handlers
 * Prevents excessive function calls during rapid events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for limiting execution rate
 * Ensures function is called at most once per specified time period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images with Intersection Observer
 * Improves initial page load performance
 */
export function lazyLoadImage(img: HTMLImageElement): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;
            const src = target.dataset.src;
            if (src) {
              target.src = src;
              target.removeAttribute('data-src');
              observer.unobserve(target);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    observer.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    const src = img.dataset.src;
    if (src) {
      img.src = src;
    }
  }
}

/**
 * Measure and log render performance
 * Useful for identifying slow components
 */
export function measureRenderTime(componentName: string, callback: () => void): void {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const renderTime = endTime - startTime;

  if (renderTime > 16.67) {
    // More than one frame (60fps = 16.67ms per frame)
    console.warn(
      `[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render (>16.67ms)`
    );
  }
}

/**
 * Request idle callback wrapper with fallback
 * Execute low-priority tasks when browser is idle
 */
export function runWhenIdle(callback: () => void, options?: IdleRequestOptions): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 1);
  }
}

/**
 * Prevent layout thrashing by batching style changes
 */
export class StyleBatcher {
  private reads: Array<() => void> = [];
  private writes: Array<() => void> = [];
  private scheduled = false;

  addRead(callback: () => void): void {
    this.reads.push(callback);
    this.schedule();
  }

  addWrite(callback: () => void): void {
    this.writes.push(callback);
    this.schedule();
  }

  private schedule(): void {
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => {
        this.flush();
      });
    }
  }

  private flush(): void {
    // Execute all reads first
    this.reads.forEach((read) => read());
    this.reads = [];

    // Then execute all writes
    this.writes.forEach((write) => write());
    this.writes = [];

    this.scheduled = false;
  }
}

/**
 * Optimize scroll performance with passive event listeners
 */
export function addPassiveScrollListener(
  element: HTMLElement | Window,
  handler: (event: Event) => void
): () => void {
  element.addEventListener('scroll', handler, { passive: true });

  // Return cleanup function
  return () => {
    element.removeEventListener('scroll', handler);
  };
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Check if element is in viewport
 * More performant than getBoundingClientRect() for multiple checks
 */
export function isInViewport(element: HTMLElement): boolean {
  if ('IntersectionObserver' in window) {
    // Use IntersectionObserver for better performance
    return new Promise<boolean>((resolve) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          resolve(entry.isIntersecting);
          observer.disconnect();
        },
        { threshold: 0 }
      );
      observer.observe(element);
    }) as unknown as boolean;
  } else {
    // Fallback
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

/**
 * Optimize animation performance with transform instead of position
 */
export function optimizeAnimation(element: HTMLElement): void {
  // Use transform for better performance (GPU accelerated)
  element.style.willChange = 'transform';

  // Clean up after animation
  element.addEventListener(
    'animationend',
    () => {
      element.style.willChange = 'auto';
    },
    { once: true }
  );
}
