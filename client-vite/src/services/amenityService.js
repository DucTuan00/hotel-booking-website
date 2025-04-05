import api from '../api';

const getAllAmenities = async (params) => {
    try {
        const response = await api.get('/amenity', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting amenity lists:', error);
        throw error;
    }
};

const getAmenityById = async (amenityId) => {
    try {
        const response = await api.get(`/amenity/${amenityId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting amenity with ID:', error);
        throw error;
    }
};

export default {
    getAllAmenities,
    getAmenityById,
};