import api from '@/services/api';
import { Restaurant } from '@/types/restaurant';

const getRestaurantInfo = async (): Promise<Restaurant> => {
    try {
        const response = await api.get<Restaurant>('/restaurant');
        return response.data;
    } catch (error) {
        console.error('Error getting restaurant info:', error);
        throw error;
    }
};

const updateRestaurantInfo = async (information: string): Promise<{ message: string }> => {
    try {
        const response = await api.put('/restaurant', { information });
        return response.data;
    } catch (error) {
        console.error('Error updating restaurant info:', error);
        throw error;
    }
};

export default {
    getRestaurantInfo,
    updateRestaurantInfo,
};