declare global {
    interface Window {
        Capacitor?: any;
    }
}

import axios from 'axios';
import { getAuthToken, isMobile, setAuthToken, removeAuthToken } from '@/utils/auth';

const isAndroid = () => {
    return typeof window !== 'undefined' &&
        window.Capacitor &&
        window.Capacitor.getPlatform &&
        window.Capacitor.getPlatform() === 'android';
};

const getBaseURL = () => {
    if (isAndroid()) {
        return 'http://10.0.2.2:3000/api';
    }
    return 'http://localhost:3000/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
});

// Add request interceptor để tự động thêm Authorization header cho mobile
api.interceptors.request.use((config) => {
    if (isMobile()) {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshResponse = await api.post('/auth/refresh-token');
                
                if (isMobile() && refreshResponse.data.accessToken) {
                    setAuthToken(refreshResponse.data.accessToken);
                    originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
                }
                
                return api(originalRequest);
            } catch (refreshError) {
                removeAuthToken();
                localStorage.removeItem('isAuthenticated');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;