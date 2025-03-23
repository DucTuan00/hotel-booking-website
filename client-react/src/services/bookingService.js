import api from '../api';

const getAllBookings = async (params) => {
    try {
        const response = await api.get('/booking', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting all bookings:', error);
        throw error;
    }
};

export default {
    getAllBookings,
};
