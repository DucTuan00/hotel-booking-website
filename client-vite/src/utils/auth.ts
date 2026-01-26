import { Capacitor } from '@capacitor/core';

/**
 * Detect if running on NATIVE mobile app (Capacitor)
 * Use for: deep links, native Google login, BottomNavigation, etc.
 * Does NOT include mobile browsers
 */
export const isNativeMobile = (): boolean => {
    return Capacitor.isNativePlatform();
};

/**
 * Detect if running on mobile browser (Safari, Chrome mobile, etc.)
 * Does NOT include native apps
 */
export const isMobileBrowser = (): boolean => {
    // If native app, return false
    if (isNativeMobile()) {
        return false;
    }

    // Check if mobile browser
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        
        // iOS detection (iPhone, iPad, iPod)
        if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            return true;
        }
        
        // Android detection
        if (/android/i.test(userAgent)) {
            return true;
        }
        
        // Additional mobile browser detection
        if (/Mobile|mini|Fennec|Windows\sPhone|webOS|BlackBerry|BB|PlayBook|IEMobile|Opera\sMini/i.test(userAgent)) {
            return true;
        }
    }

    return false;
};

/**
 * Detect if running on mobile (native app OR mobile browser)
 * Use for: auth token storage (localStorage vs cookie)
 * Mobile browsers have strict cookie policies, so need localStorage + Authorization header
 */
export const isMobile = (): boolean => {
    return isNativeMobile() || isMobileBrowser();
};

export const setAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
    }
};

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

export const removeAuthToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
    }
};

export const hasAuthToken = (): boolean => {
    return getAuthToken() !== null;
};