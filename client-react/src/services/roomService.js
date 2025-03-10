import api from '../api';

const getAllRooms = async (params) => {
    try {
        const response = await api.get('/room', { params });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách rooms:', error);
        throw error; 
    }
};

const getRoomById = async (roomId) => {
    try {
        const response = await api.get(`/room/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy room theo ID:', error);
        throw error;
    }
};

export default {
    getAllRooms,
    getRoomById,
};
