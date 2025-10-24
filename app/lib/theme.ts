/**
 * RustCare Design System
 * Consistent theme configuration based on Radix UI + Tailwind CSS
 * 
 * Usage: Import and use class names directly in components
 * Example: <div className={theme.components.card.base}>...</div>
 */

export const theme = {
  // Color Palette
  colors: {
    primary: {
      50: 'primary-50',
      100: 'primary-100',
      500: 'primary-500',
      600: 'primary-600',
      700: 'primary-700',
    },
    neutral: {
      50: 'neutral-50',
      100: 'neutral-100',
      200: 'neutral-200',
      300: 'neutral-300',
      400: 'neutral-400',
      500: 'neutral-500',
      600: 'neutral-600',
      700: 'neutral-700',
      900: 'neutral-900',
    },
    success: {
      50: 'success-50',
      500: 'success-500',
      600: 'success-600',
    },
    warning: {
      50: 'warning-50',
      500: 'warning-500',
      600: 'warning-600',
    },
    danger: {
      50: 'danger-50',
      500: 'danger-500',
      600: 'danger-600',
    },
  },
  
  // Spacing
  spacing: {
    xs: '2',    // 8px
    sm: '3',    // 12px
    md: '4',    // 16px
    lg: '6',    // 24px
    xl: '8',    // 32px
    '2xl': '12', // 48px
  },
  
  // Typography
  text: {
    xs: 'text-xs',      // 12px
    sm: 'text-sm',      // 14px
    base: 'text-base',  // 16px
    lg: 'text-lg',      // 18px
    xl: 'text-xl',      // 20px
    '2xl': 'text-2xl',  // 24px
    '3xl': 'text-3xl',  // 30px
    '4xl': 'text-4xl',  // 36px
  },
  
  // Component Styles (Tailwind classes)
  components: {
    // Button Variants
    button: {
      primary: 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      secondary: 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      outline: 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-transparent border border-primary-600 hover:bg-primary-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      ghost: 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      danger: 'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-danger-600 hover:bg-danger-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2',
    },
    
    // Card Styles
    card: {
      base: 'bg-white rounded-lg border border-neutral-200 shadow-sm',
      hover: 'bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200',
      interactive: 'bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200 cursor-pointer',
      header: 'p-6 space-y-1.5',
      content: 'p-6 pt-0',
      footer: 'p-6 pt-0 flex items-center gap-2',
    },
    
    // Input Styles
    input: {
      base: 'w-full h-10 px-3 py-2 text-sm text-neutral-900 bg-white border border-neutral-300 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors',
      error: 'w-full h-10 px-3 py-2 text-sm text-neutral-900 bg-white border border-danger-500 rounded-lg placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:border-transparent transition-colors',
      disabled: 'w-full h-10 px-3 py-2 text-sm text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-lg placeholder:text-neutral-400 opacity-50 cursor-not-allowed',
    },
    
    // Badge Styles
    badge: {
      success: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700',
      warning: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-700',
      danger: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-700',
      info: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700',
      neutral: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700',
    },
    
    // Alert Styles
    alert: {
      success: 'bg-success-50 border border-success-200 rounded-lg p-4',
      warning: 'bg-warning-50 border border-warning-200 rounded-lg p-4',
      danger: 'bg-danger-50 border border-danger-200 rounded-lg p-4',
      info: 'bg-primary-50 border border-primary-200 rounded-lg p-4',
    },
    
    // Layout
    layout: {
      container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      pageHeader: 'border-b border-neutral-200 bg-white px-6 py-4',
      pageContent: 'min-h-screen bg-neutral-50 p-6',
      section: 'space-y-6',
    },
    
    // Typography
    typography: {
      h1: 'text-3xl font-bold text-neutral-900 tracking-tight',
      h2: 'text-2xl font-semibold text-neutral-900 tracking-tight',
      h3: 'text-xl font-semibold text-neutral-900',
      h4: 'text-lg font-semibold text-neutral-900',
      body: 'text-sm text-neutral-700',
      label: 'text-sm font-medium text-neutral-700',
      caption: 'text-xs text-neutral-500',
      link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline transition-colors',
    },
    
    // Status Indicators
    status: {
      active: 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700',
      inactive: 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600',
      pending: 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-700',
    },
  },
} as const;

export type Theme = typeof theme;
