import api from '@/services/api';
import { 
    User, 
    CreateUserInput, 
    UpdateUserInput,
    UpdatePasswordInput, 
    GetAllUsersInput, 
    GetAllUsersResponse,
    LoyaltyInfo
} from '@/types/user';

const getUserInfo = async (): Promise<User> => {
    try {
        const response = await api.get('/user/info');
        return response.data;
    } catch (error) {
        console.error('Error getting user info:', error);
        throw error;
    }
};

const getAllUsers = async (params: GetAllUsersInput): Promise<GetAllUsersResponse> => {
    try {
        const response = await api.get('/user', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting user lists:', error);
        throw error;
    }
};

const getUserById = async (userId: string): Promise<User> => {
    try {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting user with ID:', error);
        throw error;
    }
};

const createUser = async (userData: CreateUserInput): Promise<{ message: string }> => {
    try {
        const response = await api.post('/user', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const updateUser = async (userId: string, userData: UpdateUserInput): Promise<{ message: string; user: User }> => {
    try {
        const response = await api.put(`/user/${userId}`, userData); 
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

const updateUserProfile = async (userData: UpdateUserInput): Promise<{ message: string; user: User }> => {
    try {
        const response = await api.put('/user', userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

const updatePassword = async (data: UpdatePasswordInput): Promise<{ message: string }> => {
    try {
        const response = await api.put('/user/password', {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        });
        return response.data;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};

const deleteUser = async (userId: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/user/${userId}`); 
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

const toggleUserActive = async (userId: string): Promise<{ message: string; active: boolean }> => {
    try {
        const response = await api.patch(`/user/${userId}/toggle-active`);
        return response.data;
    } catch (error) {
        console.error('Error toggling user active:', error);
        throw error;
    }
};

const getLoyaltyInfo = async (): Promise<LoyaltyInfo> => {
    try {
        const response = await api.get('/user/loyalty');
        return response.data;
    } catch (error) {
        console.error('Error getting loyalty info:', error);
        throw error;
    }
};

export default {
    getUserInfo,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserProfile,
    updatePassword,
    deleteUser,
    toggleUserActive,
    getLoyaltyInfo,
};
