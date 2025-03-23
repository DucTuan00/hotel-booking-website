import api from '../api';

const getAllUsers = async (params) => {
    try {
        const response = await api.get('/user', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting user lists:', error);
        throw error;
    }
};

const getUserById = async (userId) => {
    try {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting user with ID:', error);
        throw error;
    }
};

const createUser = async (userData) => {
    try {
        const response = await api.post('/user', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/user/${userId}`, userData); 
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/user/${userId}`); 
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
