import api from '@/services/api';
import { CreateSpaImageInput, GetAllSpaImagesResponse } from '@/types/spa';

const getAllSpaImages = async (): Promise<GetAllSpaImagesResponse> => {
    try {
        const response = await api.get<GetAllSpaImagesResponse>('/spa/images');
        return response.data;
    } catch (error) {
        console.error('Error getting spa images:', error);
        throw error;
    }
};

const createSpaImage = async (data: CreateSpaImageInput): Promise<{ message: string }> => {
    try {
        const response = await api.post('/spa/images', data);
        return response.data;
    } catch (error) {
        console.error('Error creating spa image:', error);
        throw error;
    }
};

const deleteSpaImage = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/spa/images/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting spa image:', error);
        throw error;
    }
};

export default {
    getAllSpaImages,
    createSpaImage,
    deleteSpaImage,
};