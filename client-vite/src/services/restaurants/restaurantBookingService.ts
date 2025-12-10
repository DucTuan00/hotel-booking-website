import api from '@/services/api';
import { 
    CreateRestaurantBookingInput, 
    RestaurantBooking,
    GetAllRestaurantBookingsResponse 
} from '@/types/restaurant';

const restaurantBookingService = {
    // User creates a restaurant booking
    createRestaurantBooking: async (data: CreateRestaurantBookingInput): Promise<RestaurantBooking> => {
        const response = await api.post('/restaurant/bookings', data);
        return response.data.booking;
    },

    // Admin gets all restaurant bookings
    getAllRestaurantBookings: async (page = 1, pageSize = 10): Promise<GetAllRestaurantBookingsResponse> => {
        const response = await api.get('/restaurant/bookings', {
            params: { page, pageSize }
        });
        return response.data;
    },

    // Admin gets a specific restaurant booking
    getRestaurantBookingById: async (id: string): Promise<RestaurantBooking> => {
        const response = await api.get(`/restaurant/bookings/${id}`);
        return response.data;
    }
};

export default restaurantBookingService;
