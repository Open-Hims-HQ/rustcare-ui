import { useEffect, useCallback, useRef, useState } from 'react';
import { throttle, addPassiveScrollListener } from '~/lib/performance';

/**
 * Custom hook to handle scroll events with performance optimization
 * Prevents forced reflows by throttling scroll handlers
 */
export function useOptimizedScroll(
  callback: (scrollY: number) => void,
  throttleMs: number = 100
) {
  const callbackRef = useRef(callback);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Memoize the throttled handler
  const throttledHandler = useCallback(
    throttle(() => {
      // Use window.scrollY instead of getBoundingClientRect() to avoid forced reflow
      const scrollY = window.scrollY || window.pageYOffset;
      callbackRef.current(scrollY);
    }, throttleMs),
    [throttleMs]
  );

  useEffect(() => {
    // Add passive scroll listener for better performance
    cleanupRef.current = addPassiveScrollListener(window, throttledHandler);

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [throttledHandler]);
}

/**
 * Custom hook for intersection observer
 * Lazy load content when it enters viewport
 */
export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(callback);
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
          ...options,
        }
      );
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return observerRef;
}

/**
 * Custom hook to track element visibility
 */
export function useIsVisible(ref: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isVisible;
}

/**
 * Custom hook for debounced window resize
 */
export function useDebounceResize(
  callback: (width: number, height: number) => void,
  debounceMs: number = 250
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callbackRef.current(window.innerWidth, window.innerHeight);
      }, debounceMs);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceMs]);
}

/**
 * Custom hook to prevent layout shift by reserving space
 */
export function usePreventLayoutShift(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Measure element dimensions before it loads
    const rect = element.getBoundingClientRect();

    // Set explicit dimensions to prevent layout shift
    if (rect.width > 0 && rect.height > 0) {
      element.style.minHeight = `${rect.height}px`;
      element.style.minWidth = `${rect.width}px`;
    }
  }, [ref]);
}
