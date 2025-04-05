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

const createAmenity = async (amenityData) => {
    try {
        const response = await api.post('/amenity', amenityData);
        return response.data;
    } catch (error) {
        console.error('Error creating amenity:', error);
        throw error;
    }
};

const updateAmenity = async (amenityId, amenityData) => {
    try {
        const response = await api.put(`/amenity/${amenityId}`, amenityData);
        return response.data;
    } catch (error) {
        console.error('Error updating amenity:', error);
        throw error;
    }
};

const deleteAmenity = async (amenityId) => {
    try {
        const response = await api.delete(`/amenity/${amenityId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting amenity:', error);
        throw error;
    }
};

export default {
    getAllAmenities,
    getAmenityById,
    createAmenity,
    updateAmenity,
    deleteAmenity,
};