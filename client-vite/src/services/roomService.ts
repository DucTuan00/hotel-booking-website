import api from '@/services/api';
import {
    Room,
    GetAllRoomsInput,
    GetAllRoomsResponse
} from '@/types/room';

const getAllRooms = async (params: GetAllRoomsInput): Promise<GetAllRoomsResponse> => {
    try {
        const response = await api.get('/room', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting room lists:', error);
        throw error; 
    }
};

const getRoomById = async (roomId: string): Promise<Room> => {
    try {
        const response = await api.get(`/room/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting room with ID:', error);
        throw error;
    }
};

const createRoom = async (formData: FormData): Promise<Room> => {
    try {
        const response = await api.post('/room', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};

const updateRoom = async (roomId: string, formData: FormData): Promise<Room> => {
    try {
        const response = await api.put(`/room/${roomId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating room:', error);
        throw error;
    }
};

const deleteRoom = async (roomId: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/room/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting room:', error);
        throw error;
    }
};

const deleteRoomImage = async (imageId: string): Promise<{ message: string }> => {
    try {
        const response = await api.delete(`/room/image/${imageId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting room image:', error);
        throw error;
    }
};

export default {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    deleteRoomImage,
};
