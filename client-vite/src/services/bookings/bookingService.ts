import api from '@/services/api';
import {
    CreateBookingInput,
    UpdateBookingInput,
    GetAllBookingsInput,
    GetAllBookingsResponse,
    Booking,
    PreviewPriceResponse,
    CelebrateItemInput,
    BookingIdInput,
    CancelBookingResponse
} from '@/types/booking';

const getAllBookings = async (params: GetAllBookingsInput): Promise<GetAllBookingsResponse> => {
    try {
        const response = await api.get<GetAllBookingsResponse>('/booking', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting all bookings:', error);
        throw error;
    }
};

const getBookingById = async (bookingId: string): Promise<Booking> => {
    try {
        const response = await api.get<Booking>(`/booking/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error(`Error getting booking ${bookingId}:`, error);
        throw error;
    }
};

const updateBooking = async (args: UpdateBookingInput): Promise<Booking> => {
    const { bookingId, status } = args;
    try {
        const response = await api.patch<Booking>(`/booking/${bookingId}`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating booking status for ID ${bookingId}:`, error);
        throw error;
    }
};

const updatePaymentStatus = async (args: { bookingId: string; paymentStatus: string }): Promise<Booking> => {
    const { bookingId, paymentStatus } = args;
    try {
        const response = await api.patch<Booking>(`/booking/${bookingId}/payment-status`, { paymentStatus });
        return response.data;
    } catch (error) {
        console.error(`Error updating payment status for ID ${bookingId}:`, error);
        throw error;
    }
};

const previewBookingPrice = async (params: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    quantity: number;
    celebrateItems?: CelebrateItemInput[];
}): Promise<PreviewPriceResponse> => {
    try {
        const queryParams = {
            roomId: params.roomId,
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            quantity: params.quantity,
            ...(params.celebrateItems && params.celebrateItems.length > 0 && {
                celebrateItems: JSON.stringify(params.celebrateItems)
            })
        };

        const response = await api.get<PreviewPriceResponse>('/booking/preview-price', {
            params: queryParams
        });
        return response.data;
    } catch (error) {
        console.error('Error previewing booking price:', error);
        throw error;
    }
};

const createBooking = async (bookingData: CreateBookingInput): Promise<Booking> => {
    try {
        const response = await api.post<Booking>('/booking', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

const cancelBooking = async (args: BookingIdInput): Promise<CancelBookingResponse> => {
    const { bookingId, cancellationReason } = args;
    try {
        const response = await api.post(`/booking/${bookingId}/cancel`, { cancellationReason });
        return response.data;
    } catch (error) {
        console.error(`Error cancelling booking ${bookingId}:`, error);
        throw error;
    }
};

const getUserBookings = async (params?: { page?: number; pageSize?: number }): Promise<GetAllBookingsResponse> => {
    try {
        const response = await api.get<GetAllBookingsResponse>('/booking/user', { params });
        return response.data;
    } catch (error) {
        console.error('Error getting user bookings:', error);
        throw error;
    }
};

export default {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    updatePaymentStatus,
    previewBookingPrice,
    cancelBooking,
    getUserBookings,
};
