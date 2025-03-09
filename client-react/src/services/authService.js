import api from '../api';
import Cookies from 'js-cookie';

const register = async (name, phone, email, password) => {
    try {
        const response = await api.post('/auth/register', { name, phone, email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const logout = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const authService = {
    register,
    login,
    logout,
};

export default authService;