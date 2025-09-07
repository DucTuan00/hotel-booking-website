import api from '@/services/api';
import {
    UpdateBookingInput,
    GetAllBookingsInput,
    GetAllBookingsResponse,
} from '@/types/booking';

const getAllBookings = async (params: GetAllBookingsInput): Promise<GetAllBookingsResponse> => {
    try {
        // Axios receives the params object
        const response = await api.get<GetAllBookingsResponse>('/booking', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting all bookings:', error);
        throw error;
    }
};

const updateBooking = async (args: UpdateBookingInput) => {
    const { bookingId, status } = args;
    try {
        const response = await api.patch(`/booking/${bookingId}`, status);
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
