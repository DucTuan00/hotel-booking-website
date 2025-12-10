import api from '@/services/api';
import { 
    CreateSpaBookingInput, 
    SpaBooking,
    GetAllSpaBookingsResponse 
} from '@/types/spa';

const spaBookingService = {
    // User creates a spa booking
    createSpaBooking: async (data: CreateSpaBookingInput): Promise<SpaBooking> => {
        const response = await api.post('/spa/bookings', data);
        return response.data.booking;
    },

    // Admin gets all spa bookings
    getAllSpaBookings: async (page = 1, pageSize = 10): Promise<GetAllSpaBookingsResponse> => {
        const response = await api.get('/spa/bookings', {
            params: { page, pageSize }
        });
        return response.data;
    },

    // Admin gets a specific spa booking
    getSpaBookingById: async (id: string): Promise<SpaBooking> => {
        const response = await api.get(`/spa/bookings/${id}`);
        return response.data;
    }
};

export default spaBookingService;
