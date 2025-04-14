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

const updateBooking = async (bookingId, bookingData) => {
    try {
        const response = await api.patch(`/booking/${bookingId}`, bookingData);
        return response.data;
    } catch (error) {
        console.error(`Error updating booking status for ID ${bookingId}:`, error);
        throw error;
    }
};

export default {
    getAllBookings,
    updateBooking,
};
