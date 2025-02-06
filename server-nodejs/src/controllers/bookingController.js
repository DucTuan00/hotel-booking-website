import bookingService from '../services/bookingService.js';
import ApiError from '../utils/apiError.js';

const createBooking = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { room_id, check_in, check_out, guests, quantity } = req.body;

        try {
            const booking = await bookingService.createBooking(
                user_id, 
                room_id, 
                check_in, 
                check_out, 
                guests,
                quantity,
            );
            
            res.status(201).json(booking);
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getBookingById = async (req, res, next) => {
    try {
        const booking_id = req.params.id;
        const booking = await bookingService.getBookingById(booking_id);
        res.status(200).json(booking);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getBookingsByUserId = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const bookings = await bookingService.getBookingsByUserId(user_id);
        res.status(200).json(bookings);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const cancelBooking = async (req, res, next) => {
    try {
        const booking_id = req.params.id;
        const booking = await bookingService.cancelBooking(booking_id);
        res.status(200).json(booking);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export default {
    createBooking,
    getBookingById,
    getBookingsByUserId,
    cancelBooking,
};