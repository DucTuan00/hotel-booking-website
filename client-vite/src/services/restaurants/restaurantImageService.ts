import api from '@/services/api';
import { 
    RestaurantImage, 
    CreateRestaurantImageInput, 
    GetAllRestaurantImagesResponse 
} from '@/types/restaurant';

const getAllRestaurantImages = async (): Promise<GetAllRestaurantImagesResponse> => {
    try {
        const response = await api.get<GetAllRestaurantImagesResponse>('/restaurant/images');
        return response.data;
    } catch (error) {
        console.error('Error getting restaurant images:', error);
        throw error;
    }
};

const createRestaurantImage = async (data: CreateRestaurantImageInput): Promise<{ message: string; image: RestaurantImage }> => {
    try {
        const response = await api.post('/restaurant/images', data);
        return response.data;
    } catch (error) {
        console.error('Error creating restaurant image:', error);
        throw error;
    }
};

const deleteRestaurantImage = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/restaurant/images/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting restaurant image:', error);
        throw error;
    }
};

export default {
    getAllRestaurantImages,
    createRestaurantImage,
    deleteRestaurantImage,
};
