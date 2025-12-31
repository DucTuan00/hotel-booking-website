import { GoogleAuth } from '@southdevs/capacitor-google-auth';
import api from '@/services/api';
import { isMobile, setAuthToken } from '@/utils/auth';

interface GoogleLoginResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    role: string;
}

/**
 * Initialize Google Auth plugin (call once on app start for mobile)
 */
export const initGoogleAuth = async (): Promise<void> => {
    if (!isMobile()) return;

    try {
        await GoogleAuth.initialize({
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
        });
        console.log('GoogleAuth initialized successfully');
    } catch (error) {
        console.error('Failed to initialize GoogleAuth:', error);
    }
};

/**
 * Perform native Google Sign-In on mobile
 * Returns user data and tokens from backend
 */
export const signInWithGoogle = async (): Promise<GoogleLoginResponse> => {
    try {
        // Trigger native Google Sign-In
        const googleUser = await GoogleAuth.signIn();
        
        console.log('Google Sign-In result:', googleUser);

        // Get the idToken from authentication
        const idToken = googleUser.authentication?.idToken;
        
        if (!idToken) {
            throw new Error('Không nhận được idToken từ Google');
        }

        // Send idToken to backend for verification
        const response = await api.post<GoogleLoginResponse>('/auth/google/mobile', {
            idToken,
        });

        // Save access token for mobile
        if (response.data.accessToken) {
            setAuthToken(response.data.accessToken);
        }

        return response.data;
    } catch (error: any) {
        console.error('Google Sign-In error:', error);
        
        // Handle user cancellation
        if (error.error === 'popup_closed_by_user' || 
            error.message?.includes('cancel') ||
            error.message?.includes('12501')) {
            throw new Error('Đăng nhập bị hủy');
        }
        
        throw new Error(error.message || 'Đăng nhập Google thất bại');
    }
};

/**
 * Sign out from Google (mobile only)
 */
export const signOutFromGoogle = async (): Promise<void> => {
    if (!isMobile()) return;

    try {
        await GoogleAuth.signOut();
        console.log('Google Sign-Out successful');
    } catch (error) {
        console.error('Google Sign-Out error:', error);
    }
};

/**
 * Check if user is already signed in with Google
 */
export const isGoogleSignedIn = async (): Promise<boolean> => {
    if (!isMobile()) return false;

    try {
        // Try to refresh token silently
        await GoogleAuth.refresh();
        return true;
    } catch {
        return false;
    }
};

const googleAuthService = {
    initGoogleAuth,
    signInWithGoogle,
    signOutFromGoogle,
    isGoogleSignedIn,
};

export default googleAuthService;
