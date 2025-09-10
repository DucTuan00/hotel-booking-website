// Design system constants for hotel boutique website
export const COLORS = {
    // Primary colors
    primary: '#D4902A', // Gold color from logo
    primaryDark: '#B8761E',
    primaryLight: '#E6B655',

    // Secondary colors
    secondary: '#8B1A1A', // Dark red from design
    secondaryDark: '#6B1414',
    secondaryLight: '#A52A2A',

    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Background colors
    background: '#F8F9FA',
    overlay: 'rgba(0, 0, 0, 0.5)',
};

export const TYPOGRAPHY = {
    fontFamily: {
        primary: '"Playfair Display", serif', // Elegant serif font for headings
        secondary: '"Inter", sans-serif', // Clean sans-serif for body text
    },
    fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
    },
    fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
};

export const SPACING = {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
    '5xl': '8rem',    // 128px
};

export const BREAKPOINTS = {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

export const ANIMATIONS = {
    duration: {
        fast: '200ms',
        normal: '300ms',
        slow: '500ms',
        slower: '800ms',
    },
    easing: {
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
};

export const LAYOUT = {
    header: {
        height: '60px', // Reduced for mobile
        heightDesktop: '80px',
    },
    container: {
        maxWidth: '1200px',
        padding: '0 1rem',
        paddingMobile: '0 0.75rem',
    },
    section: {
        padding: '3rem 0', // Reduced for mobile
        paddingDesktop: '4rem 0',
    },
};

export const DEMO_IMAGES = {
    // Demo images for development
    hero: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    lionBoutique: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    lionWestlake: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    spa: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    familySuite: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    cocktailBar: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    restaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    haLongBay: 'https://images.unsplash.com/photo-1587734195503-904fca47e0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    sapa: 'https://images.unsplash.com/photo-1583417267826-aea9dc1464db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    hoiAn: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
};
