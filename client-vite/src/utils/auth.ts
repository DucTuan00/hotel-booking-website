declare global {
    interface Window {
        Capacitor?: any;
    }
}

/**
 * Detect if running on mobile (native app OR mobile browser)
 */
export const isMobile = (): boolean => {
    // Check if native mobile app (Capacitor)
    if (typeof window !== 'undefined' &&
        window.Capacitor &&
        window.Capacitor.getPlatform &&
        (window.Capacitor.getPlatform() === 'android' || window.Capacitor.getPlatform() === 'ios')) {
        return true;
    }

    // Check if mobile browser (Safari, Chrome mobile, etc.)
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
        if (/Mobile|mini|Fennec|Windows\sPhone|Android|iP(ad|od|hone)|webOS|BlackBerry|BB|PlayBook|IEMobile|Opera\sMini/i.test(userAgent)) {
            return true;
        }
    }

    return false;
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