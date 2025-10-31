/**
 * Auth Events Utility
 * Manages custom events for authentication state changes
 */

export const AUTH_EVENTS = {
    LOGIN_SUCCESS: 'userLoginSuccess',
    LOGOUT_SUCCESS: 'userLogoutSuccess',
} as const;

/**
 * Dispatch login success event
 * Call this after successful login to notify components (e.g., Header)
 */
export const dispatchLoginSuccess = () => {
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGIN_SUCCESS));
};

/**
 * Dispatch logout success event
 * Call this after successful logout to notify components
 */
export const dispatchLogoutSuccess = () => {
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT_SUCCESS));
};

/**
 * Listen for login success event
 * @param callback - Function to call when login succeeds
 * @returns Cleanup function to remove event listener
 */
export const onLoginSuccess = (callback: () => void) => {
    window.addEventListener(AUTH_EVENTS.LOGIN_SUCCESS, callback);
    return () => window.removeEventListener(AUTH_EVENTS.LOGIN_SUCCESS, callback);
};

/**
 * Listen for logout success event
 * @param callback - Function to call when logout succeeds
 * @returns Cleanup function to remove event listener
 */
export const onLogoutSuccess = (callback: () => void) => {
    window.addEventListener(AUTH_EVENTS.LOGOUT_SUCCESS, callback);
    return () => window.removeEventListener(AUTH_EVENTS.LOGOUT_SUCCESS, callback);
};
