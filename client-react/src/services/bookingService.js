import api from '../api';

const getAllBookings = async (params) => {
    try {
        const response = await api.get('/booking', { params });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bookings:', error);
        throw error;
    }
};

export default {
    getAllBookings,
};
