/**
 * Global Accessibility Configuration
 * 
 * Centralized configuration for WCAG AAA compliance
 * - Audio feedback preferences
 * - Braille display support
 * - Screen reader optimizations
 * - User preferences management
 */

export interface AccessibilityPreferences {
  // Audio feedback
  audioEnabled: boolean;
  audioRate: number; // 0.1 - 10
  audioPitch: number; // 0 - 2
  audioVolume: number; // 0 - 1
  
  // Visual
  highContrast: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'xlarge';
  reduceMotion: boolean;
  
  // Braille
  brailleEnabled: boolean;
  
  // Screen reader
  verboseAnnouncements: boolean;
  
  // Keyboard navigation
  keyboardNavigationHighlight: boolean;
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  audioEnabled: true,
  audioRate: 1.0,
  audioPitch: 1.0,
  audioVolume: 1.0,
  highContrast: false,
  fontSize: 'normal',
  reduceMotion: false,
  brailleEnabled: true,
  verboseAnnouncements: false,
  keyboardNavigationHighlight: true,
};

// Storage key for user preferences
const STORAGE_KEY = 'rustcare-a11y-preferences';

/**
 * Load accessibility preferences from localStorage
 */
export function loadAccessibilityPreferences(): AccessibilityPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load accessibility preferences:', error);
  }
  
  return DEFAULT_PREFERENCES;
}

/**
 * Save accessibility preferences to localStorage
 */
export function saveAccessibilityPreferences(prefs: Partial<AccessibilityPreferences>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const current = loadAccessibilityPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Apply preferences immediately
    applyAccessibilityPreferences(updated);
  } catch (error) {
    console.error('Failed to save accessibility preferences:', error);
  }
}

/**
 * Apply accessibility preferences to the document
 */
export function applyAccessibilityPreferences(prefs: AccessibilityPreferences): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Apply high contrast
  if (prefs.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
  
  // Apply reduce motion
  if (prefs.reduceMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }
  
  // Apply font size
  root.setAttribute('data-font-size', prefs.fontSize);
  
  // Apply keyboard navigation highlight
  if (prefs.keyboardNavigationHighlight) {
    root.classList.add('keyboard-navigation');
  } else {
    root.classList.remove('keyboard-navigation');
  }
  
  // Apply braille optimizations
  if (prefs.brailleEnabled) {
    root.classList.add('braille-optimized');
  } else {
    root.classList.remove('braille-optimized');
  }
}

/**
 * Initialize accessibility on page load
 */
export function initAccessibility(): void {
  if (typeof window === 'undefined') return;
  
  const prefs = loadAccessibilityPreferences();
  applyAccessibilityPreferences(prefs);
}

/**
 * Check if browser supports required features
 */
export function checkAccessibilitySupport(): {
  speechSynthesis: boolean;
  localStorage: boolean;
  mediaQueries: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      speechSynthesis: false,
      localStorage: false,
      mediaQueries: false,
    };
  }
  
  return {
    speechSynthesis: 'speechSynthesis' in window,
    localStorage: typeof Storage !== 'undefined',
    mediaQueries: typeof window.matchMedia !== 'undefined',
  };
}

// CSS classes and utilities

/**
 * Screen reader only text
 */
export const srOnly = 'sr-only';

/**
 * Focus visible only
 */
export const focusVisible = 'focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:ring-2';

/**
 * High contrast mode classes
 */
export const highContrastColors = {
  text: 'high-contrast:text-gray-900',
  bg: 'high-contrast:bg-white',
  border: 'high-contrast:border-2 high-contrast:border-gray-900',
};

/**
 * Font size utilities
 */
export const fontSizeClasses = {
  small: 'data-[font-size=small]:text-sm',
  normal: 'data-[font-size=normal]:text-base',
  large: 'data-[font-size=large]:text-lg',
  xlarge: 'data-[font-size=xlarge]:text-xl',
};

/**
 * Keyboard navigation classes
 */
export const keyboardFocus = 'keyboard-navigation:focus-visible:ring-2 keyboard-navigation:focus-visible:ring-blue-600 keyboard-navigation:focus-visible:outline-none';

/**
 * Skip to main content link
 */
export const skipToContentClasses = [
  srOnly,
  'focus:not-sr-only',
  'focus:absolute',
  'focus:z-50',
  'focus:m-4',
  'focus:rounded-md',
  'focus:bg-blue-600',
  'focus:px-4',
  'focus:py-2',
  'focus:text-white',
  'focus:shadow-lg',
].join(' ');

/**
 * Accessible heading levels
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Get ARIA heading level
 */
export function getHeadingLevel(level: HeadingLevel): string {
  return `h${level}`;
}

/**
 * Get ARIA labelledby
 */
export function getLabelledBy(id: string): string {
  return `${id}-label`;
}

/**
 * Get ARIA describedby
 */
export function getDescribedBy(id: string): string {
  return `${id}-description`;
}

// React hook for accessibility preferences

import { useEffect, useState } from 'react';

export function useAccessibility() {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(() => 
    typeof window !== 'undefined' ? loadAccessibilityPreferences() : DEFAULT_PREFERENCES
  );
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Apply preferences on mount
    applyAccessibilityPreferences(prefs);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    // Listen for storage changes (synced across tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newPrefs = JSON.parse(e.newValue);
          setPrefs(newPrefs);
          applyAccessibilityPreferences(newPrefs);
        } catch (error) {
          console.error('Failed to parse accessibility preferences:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isClient]);
  
  const updatePreferences = (newPrefs: Partial<AccessibilityPreferences>) => {
    if (typeof window === 'undefined') return;
    saveAccessibilityPreferences(newPrefs);
    setPrefs(loadAccessibilityPreferences());
  };
  
  const support = isClient ? checkAccessibilitySupport() : {
    speechSynthesis: false,
    localStorage: false,
    mediaQueries: false,
  };
  
  return {
    preferences: prefs,
    updatePreferences,
    support,
  };
}

