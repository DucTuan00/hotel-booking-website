import api from '@/services/api';
import {
    CreateReviewInput,
    Review,
    GetReviewsByRoomResponse,
    ReviewEligibility,
    RoomRating,
    EligibleBooking
} from '@/types/review';

const createReview = async (data: CreateReviewInput): Promise<Review> => {
    try {
        const response = await api.post('/review', data);
        return response.data.data;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

const getReviewsByRoom = async (
    roomId: string,
    page: number = 1,
    pageSize: number = 10
): Promise<GetReviewsByRoomResponse> => {
    try {
        const response = await api.get(`/review/room/${roomId}`, {
            params: { page, pageSize }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error getting reviews:', error);
        throw error;
    }
};

const checkReviewEligibility = async (bookingId: string): Promise<ReviewEligibility> => {
    try {
        const response = await api.get(`/review/eligibility/${bookingId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error checking review eligibility:', error);
        throw error;
    }
};

const getRoomRating = async (roomId: string): Promise<RoomRating> => {
    try {
        const response = await api.get(`/review/room/${roomId}/rating`);
        return response.data.data;
    } catch (error) {
        console.error('Error getting room rating:', error);
        throw error;
    }
};

const getEligibleBookingsForReview = async (): Promise<EligibleBooking[]> => {
    try {
        const response = await api.get('/review/eligible-bookings');
        return response.data.data;
    } catch (error) {
        console.error('Error getting eligible bookings:', error);
        throw error;
    }
};

const reviewService = {
    createReview,
    getReviewsByRoom,
    checkReviewEligibility,
    getRoomRating,
    getEligibleBookingsForReview
};

export default reviewService;
