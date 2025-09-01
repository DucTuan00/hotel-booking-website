declare global {
    interface Window {
        Capacitor?: any;
    }
}

import axios from 'axios';

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

export default api;