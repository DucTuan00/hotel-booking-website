import api from '@/services/api';
import axios from 'axios';
import { setAuthToken, removeAuthToken, isMobile } from '@/utils/auth';
import {
    RegisterInput,
    LoginInput,
    MessageResponse,
} from '@/types/auth';

const register = async (args: RegisterInput): Promise<MessageResponse> => {
    try {
        const response = await api.post<MessageResponse>('/auth/register', args);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
        }
        throw error;
    }
};

const login = async (args: LoginInput): Promise<MessageResponse> => {
    try {
        const response = await api.post<MessageResponse>('/auth/login', args);
        
        // Only save accessToken to storage for mobile apps (not web)
        if (isMobile() && response.data.accessToken) {
            setAuthToken(response.data.accessToken);
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
        }
        throw error;
    }
};

const logout = async (): Promise<MessageResponse> => {
    try {
        const response = await api.post<MessageResponse>('/auth/logout');

        // Remove token from storage (mobile) and clear any cached auth state
        removeAuthToken();

        return response.data;
    } catch (error) {
        removeAuthToken();
        if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
        }
        throw error;
    }
};

const verifyToken = async (): Promise<{ userId: string; role: string }> => {
    try {
        const response = await api.post<{ userId: string; role: string }>('/auth/verify-token');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
        }
        throw error;
    }
};

const refreshToken = async (): Promise<{ accessToken: string; message: string }> => {
    try {
        const response = await api.post<{ accessToken: string; message: string }>('/auth/refresh-token');
        
        // Update token in storage for mobile
        if (response.data.accessToken) {
            setAuthToken(response.data.accessToken);
        }
        
        return response.data;
    } catch (error) {
        // If refresh fails, remove tokens and redirect to login
        removeAuthToken();
        if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
        }
        throw error;
    }
};

const authService = {
    register,
    login,
    logout,
    verifyToken,
    refreshToken,
};

export default authService;