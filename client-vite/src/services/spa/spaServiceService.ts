import api from '@/services/api';
import { 
    SpaService, 
    CreateSpaServiceInput, 
    UpdateSpaServiceInput, 
    GetAllSpaServicesResponse 
} from '@/types/spa';

const getAllSpaServices = async (): Promise<GetAllSpaServicesResponse> => {
    try {
        const response = await api.get<GetAllSpaServicesResponse>('/spa/services');
        return response.data;
    } catch (error) {
        console.error('Error getting spa services:', error);
        throw error;
    }
};

const getSpaServiceById = async (id: string): Promise<SpaService> => {
    try {
        const response = await api.get<SpaService>(`/spa/services/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting spa service:', error);
        throw error;
    }
};

const createSpaService = async (data: CreateSpaServiceInput): Promise<{ message: string; service: SpaService }> => {
    try {
        const response = await api.post('/spa/services', data);
        return response.data;
    } catch (error) {
        console.error('Error creating spa service:', error);
        throw error;
    }
};

const updateSpaService = async (id: string, data: UpdateSpaServiceInput): Promise<{ message: string; service: SpaService }> => {
    try {
        const response = await api.put(`/spa/services/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating spa service:', error);
        throw error;
    }
};

const deleteSpaService = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/spa/services/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting spa service:', error);
        throw error;
    }
};

export default {
    getAllSpaServices,
    getSpaServiceById,
    createSpaService,
    updateSpaService,
    deleteSpaService,
};