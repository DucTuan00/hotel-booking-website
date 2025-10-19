import api from '@/services/api';
import {
    Room,
    CreateRoomInput,
    UpdateRoomInput,
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

const getActiveRooms = async (params: GetAllRoomsInput): Promise<GetAllRoomsResponse> => {
    try {
        const response = await api.get('/room/active', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting active room lists:', error);
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

const createRoom = async (data: CreateRoomInput): Promise<Room> => {
    try {
        const response = await api.post('/room', data);
        return response.data;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};

const updateRoom = async (roomId: string, data: UpdateRoomInput): Promise<Room> => {
    try {
        const response = await api.put(`/room/${roomId}`, data);
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

const toggleRoomActive = async (roomId: string): Promise<{ message: string; active: boolean }> => {
    try {
        const response = await api.patch(`/room/${roomId}/toggle-active`);
        return response.data;
    } catch (error) {
        console.error('Error toggling room active status:', error);
        throw error;
    }
};

export default {
    getAllRooms,
    getActiveRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    deleteRoomImage,
    toggleRoomActive,
};
