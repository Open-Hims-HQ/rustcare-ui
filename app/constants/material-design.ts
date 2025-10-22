/**
 * Material Design 3 Specifications
 * https://m3.material.io/
 * 
 * Design tokens for spacing, elevation, motion, and shape
 */

// Spacing Scale (dp to px, 1dp = 1px at 1x density)
export const MD3_SPACING = {
  xs: '4px',    // 4dp
  sm: '8px',    // 8dp
  md: '12px',   // 12dp
  lg: '16px',   // 16dp
  xl: '24px',   // 24dp
  '2xl': '32px', // 32dp
  '3xl': '40px', // 40dp
  '4xl': '48px', // 48dp
  '5xl': '64px', // 64dp
} as const;

// Border Radius (Shape Scale)
export const MD3_RADIUS = {
  none: '0px',
  xs: '4px',     // Extra small - chips
  sm: '8px',     // Small - cards
  md: '12px',    // Medium - buttons
  lg: '16px',    // Large - FABs
  xl: '28px',    // Extra large - sheets
  full: '9999px', // Full - pills
} as const;

// Elevation Levels (Shadow depth)
export const MD3_ELEVATION = {
  0: 'none',
  1: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
  2: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
  3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)',
  4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.3)',
  5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.3)',
} as const;

// Typography Scale
export const MD3_TYPOGRAPHY = {
  // Display
  displayLarge: {
    size: '57px',
    lineHeight: '64px',
    weight: '400',
    letterSpacing: '-0.25px',
  },
  displayMedium: {
    size: '45px',
    lineHeight: '52px',
    weight: '400',
    letterSpacing: '0px',
  },
  displaySmall: {
    size: '36px',
    lineHeight: '44px',
    weight: '400',
    letterSpacing: '0px',
  },
  
  // Headline
  headlineLarge: {
    size: '32px',
    lineHeight: '40px',
    weight: '400',
    letterSpacing: '0px',
  },
  headlineMedium: {
    size: '28px',
    lineHeight: '36px',
    weight: '400',
    letterSpacing: '0px',
  },
  headlineSmall: {
    size: '24px',
    lineHeight: '32px',
    weight: '400',
    letterSpacing: '0px',
  },
  
  // Title
  titleLarge: {
    size: '22px',
    lineHeight: '28px',
    weight: '400',
    letterSpacing: '0px',
  },
  titleMedium: {
    size: '16px',
    lineHeight: '24px',
    weight: '500',
    letterSpacing: '0.15px',
  },
  titleSmall: {
    size: '14px',
    lineHeight: '20px',
    weight: '500',
    letterSpacing: '0.1px',
  },
  
  // Body
  bodyLarge: {
    size: '16px',
    lineHeight: '24px',
    weight: '400',
    letterSpacing: '0.5px',
  },
  bodyMedium: {
    size: '14px',
    lineHeight: '20px',
    weight: '400',
    letterSpacing: '0.25px',
  },
  bodySmall: {
    size: '12px',
    lineHeight: '16px',
    weight: '400',
    letterSpacing: '0.4px',
  },
  
  // Label
  labelLarge: {
    size: '14px',
    lineHeight: '20px',
    weight: '500',
    letterSpacing: '0.1px',
  },
  labelMedium: {
    size: '12px',
    lineHeight: '16px',
    weight: '500',
    letterSpacing: '0.5px',
  },
  labelSmall: {
    size: '11px',
    lineHeight: '16px',
    weight: '500',
    letterSpacing: '0.5px',
  },
} as const;

// Motion (Duration & Easing)
export const MD3_MOTION = {
  duration: {
    short1: '50ms',
    short2: '100ms',
    short3: '150ms',
    short4: '200ms',
    medium1: '250ms',
    medium2: '300ms',
    medium3: '350ms',
    medium4: '400ms',
    long1: '450ms',
    long2: '500ms',
    long3: '550ms',
    long4: '600ms',
    extraLong1: '700ms',
    extraLong2: '800ms',
    extraLong3: '900ms',
    extraLong4: '1000ms',
  },
  easing: {
    // Standard easing
    standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    // Emphasized easing (for important transitions)
    emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
    // Legacy (compatibility)
    legacy: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
    legacyDecelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    legacyAccelerate: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
  },
} as const;

// State Layers (Interaction feedback opacity)
export const MD3_STATE_LAYERS = {
  hover: 0.08,      // 8%
  focus: 0.12,      // 12%
  pressed: 0.12,    // 12%
  dragged: 0.16,    // 16%
} as const;

// Opacity Levels
export const MD3_OPACITY = {
  disabled: 0.38,   // 38%
  inactive: 0.60,   // 60%
  active: 1.0,      // 100%
} as const;

// Component Heights
export const MD3_HEIGHTS = {
  button: {
    small: '32px',
    medium: '40px',
    large: '48px',
  },
  input: {
    filled: '56px',
    outlined: '56px',
  },
  chip: {
    small: '32px',
    medium: '32px',
  },
  fab: {
    small: '40px',
    medium: '56px',
    large: '96px',
  },
  appBar: '64px',
  bottomBar: '80px',
  listItem: {
    oneL: '56px',
    twoL: '72px',
    threeL: '88px',
  },
} as const;

// Touch Targets (Minimum 48x48dp)
export const MD3_TOUCH_TARGET = {
  minimum: '48px',
} as const;
