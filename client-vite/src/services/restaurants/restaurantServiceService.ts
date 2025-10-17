import api from '@/services/api';
import { 
    RestaurantService, 
    CreateRestaurantServiceInput, 
    UpdateRestaurantServiceInput, 
    GetAllRestaurantServicesResponse 
} from '@/types/restaurant';

const getAllRestaurantServices = async (search?: string): Promise<GetAllRestaurantServicesResponse> => {
    try {
        const params = search ? { search } : {};
        const response = await api.get<GetAllRestaurantServicesResponse>('/restaurant/services', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting restaurant services:', error);
        throw error;
    }
};

const getRestaurantServiceById = async (id: string): Promise<RestaurantService> => {
    try {
        const response = await api.get<RestaurantService>(`/restaurant/services/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting restaurant service:', error);
        throw error;
    }
};

const createRestaurantService = async (data: CreateRestaurantServiceInput): Promise<{ message: string; service: RestaurantService }> => {
    try {
        const response = await api.post('/restaurant/services', data);
        return response.data;
    } catch (error) {
        console.error('Error creating restaurant service:', error);
        throw error;
    }
};

const updateRestaurantService = async (id: string, data: UpdateRestaurantServiceInput): Promise<{ message: string; service: RestaurantService }> => {
    try {
        const response = await api.put(`/restaurant/services/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating restaurant service:', error);
        throw error;
    }
};

const deleteRestaurantService = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/restaurant/services/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting restaurant service:', error);
        throw error;
    }
};

export default {
    getAllRestaurantServices,
    getRestaurantServiceById,
    createRestaurantService,
    updateRestaurantService,
    deleteRestaurantService,
};