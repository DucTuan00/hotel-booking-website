import api from '@/services/api';
import {
    Amenity,
    AmenityIdInput,
    CreateAmenityInput,
    DeleteAmenityResponse,
    GetAllAmenitiesInput,
    GetAllAmenitiesResponse,
    UpdateAmenityInput,
} from '@/types/amenity';

const getAllAmenities = async (params: GetAllAmenitiesInput): Promise<GetAllAmenitiesResponse> => {
    try {
        const response = await api.get<GetAllAmenitiesResponse>('/amenity', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting amenity lists:', error);
        throw error;
    }
};

const getAmenityById = async (amenityId: string): Promise<Amenity> => {
    try {
        const response = await api.get<Amenity>(`/amenity/${amenityId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting amenity with ID:', error);
        throw error;
    }
};

const createAmenity = async (amenityData: CreateAmenityInput): Promise<Amenity> => {
    try {
        const response = await api.post<Amenity>('/amenity', amenityData);
        return response.data;
    } catch (error) {
        console.error('Error creating amenity:', error);
        throw error;
    }
};

const updateAmenity = async (amenityData: UpdateAmenityInput): Promise<Amenity> => {
    try {
        const { id, name } = amenityData;
        const response = await api.put<Amenity>(`/amenity/${id}`, { name });
        return response.data;
    } catch (error) {
        console.error('Error updating amenity:', error);
        throw error;
    }
};

const deleteAmenity = async (amenityId: AmenityIdInput): Promise<DeleteAmenityResponse> => {
    try {
        const response = await api.delete<DeleteAmenityResponse>(`/amenity/${amenityId}`);
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