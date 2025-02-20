import api from '../api';

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

const authService = {
    register,
    login,
};

export default authService;