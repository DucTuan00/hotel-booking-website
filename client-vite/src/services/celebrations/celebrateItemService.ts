import api from '@/services/api';
import { 
    CelebrateItem, 
    CreateCelebrateItemInput, 
    UpdateCelebrateItemInput, 
    GetAllCelebrateItemsResponse 
} from '@/types/celebrate';

const getAllCelebrateItems = async (search?: string): Promise<GetAllCelebrateItemsResponse> => {
    try {
        const params = search ? { search } : {};
        const response = await api.get<GetAllCelebrateItemsResponse>('/celebrate-item', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting celebrate items:', error);
        throw error;
    }
};

const getCelebrateItemById = async (id: string): Promise<CelebrateItem> => {
    try {
        const response = await api.get<CelebrateItem>(`/celebrate-item/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting celebrate item:', error);
        throw error;
    }
};

const createCelebrateItem = async (data: CreateCelebrateItemInput): Promise<{ message: string; item: CelebrateItem }> => {
    try {
        const response = await api.post('/celebrate-item', data);
        return response.data;
    } catch (error) {
        console.error('Error creating celebrate item:', error);
        throw error;
    }
};

const updateCelebrateItem = async (id: string, data: UpdateCelebrateItemInput): Promise<{ message: string; item: CelebrateItem }> => {
    try {
        const response = await api.put(`/celebrate-item/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating celebrate item:', error);
        throw error;
    }
};

const deleteCelebrateItem = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/celebrate-item/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting celebrate item:', error);
        throw error;
    }
};

export default {
    getAllCelebrateItems,
    getCelebrateItemById,
    createCelebrateItem,
    updateCelebrateItem,
    deleteCelebrateItem,
};
