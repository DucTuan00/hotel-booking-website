import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/utils/auth';

const isAndroid = () => {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
};

const getBaseURL = () => {
    const envApiUrl = import.meta.env.VITE_API_BASE_URL;
    if (envApiUrl) {
        return envApiUrl;
    }
    
    // Development mode
    if (isAndroid()) {
        // Android emulator uses special IP
        return import.meta.env.VITE_ANDROID_API_URL;
    }
    
    // Web development
    return 'http://localhost:3000/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

// Track if currently refreshing to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

// Add request interceptor to auto add Authorization header
// Use localStorage token if available (for OAuth/Payment callbacks), otherwise rely on cookies
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Only attempt to refresh if we get a 401 and we haven't already retried
        if (error.response?.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url?.includes('/auth/refresh-token')) {
            
            if (isRefreshing) {
                // If we're already refreshing, queue the request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                console.log('🔄 Access token expired, refreshing...');
                const refreshResponse = await axios.post(
                    `${getBaseURL()}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                
                const newAccessToken = refreshResponse.data.accessToken;
                console.log('✅ Token refreshed successfully');
                
                if (newAccessToken) {
                    setAuthToken(newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                
                processQueue(null, newAccessToken);
                isRefreshing = false;
                
                return api(originalRequest);
            } catch (refreshError) {
                console.error('❌ Refresh token failed:', refreshError);
                processQueue(refreshError, null);
                isRefreshing = false;
                removeAuthToken();
                localStorage.removeItem('isAuthenticated');
                
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;