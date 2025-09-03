declare global {
    interface Window {
        Capacitor?: any;
    }
}

export const isMobile = (): boolean => {
    return typeof window !== 'undefined' &&
        window.Capacitor &&
        window.Capacitor.getPlatform &&
        (window.Capacitor.getPlatform() === 'android' || window.Capacitor.getPlatform() === 'ios');
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