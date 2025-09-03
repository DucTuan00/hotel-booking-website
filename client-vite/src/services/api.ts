declare global {
    interface Window {
        Capacitor?: any;
    }
}

import axios from 'axios';
import { getAuthToken, isMobile } from '@/utils/auth';

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

export default api;