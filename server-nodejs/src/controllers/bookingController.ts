import bookingService from '@/services/bookingService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id: string | undefined = req.user?.id;
        const { room_id, check_in, check_out, guests, quantity } = req.body;

        if (!user_id) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }

        try {
            const booking = await bookingService.createBooking({
                user_id, 
                room_id, 
                check_in, 
                check_out, 
                guests,
                quantity,
            });
            
            res.status(201).json(booking);
        } catch (error: any) {
            next(error);
        }
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking_id: string = req.params.id;
        const booking = await bookingService.getBookingById({ booking_id });
        res.status(200).json(booking);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getBookingsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id: string | undefined = req.user?.id;
        if (!user_id) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }
        const bookings = await bookingService.getBookingsByUserId({ user_id });
        res.status(200).json(bookings);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking_id: string = req.params.id;
        const booking = await bookingService.cancelBooking({ booking_id });
        res.status(200).json(booking);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, pageSize = 10, ...filter } = req.query;
        const bookings = await bookingService.getAllBookings({
            ...filter, 
            page: parseInt(page as string), 
            pageSize: parseInt(pageSize as string)
        });
        res.json(bookings);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking_id: string = req.params.id;
        const { status } = req.body; 

        const updatedBooking = await bookingService.updateBooking({ booking_id, status });
        res.json(updatedBooking);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export default {
    createBooking,
    getBookingById,
    getBookingsByUserId,
    cancelBooking,
    getAllBookings,
    updateBooking,
};
