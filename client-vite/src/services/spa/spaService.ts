import api from '@/services/api';
import { Spa } from '@/types/spa';

const getSpaInfo = async (): Promise<Spa> => {
    try {
        const response = await api.get<Spa>('/spa');
        return response.data;
    } catch (error) {
        console.error('Error getting spa info:', error);
        throw error;
    }
};

const updateSpaInfo = async (information: string): Promise<{ message: string }> => {
    try {
        const response = await api.put('/spa', { information });
        return response.data;
    } catch (error) {
        console.error('Error updating spa info:', error);
        throw error;
    }
};

export default {
    getSpaInfo,
    updateSpaInfo,
};