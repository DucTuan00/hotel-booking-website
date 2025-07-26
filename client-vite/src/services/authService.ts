import api from '@/services/api';
import axios from 'axios';
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
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
        }
        throw error;
    }
}

const authService = {
    register,
    login,
    logout,
};

export default authService;