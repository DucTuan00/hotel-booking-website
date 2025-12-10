import { Request, Response, NextFunction } from 'express';
import * as restaurantBookingService from '@/services/restaurants/restaurantBookingService';
import ApiError from '@/utils/apiError';

export async function createRestaurantBooking(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        const { fullName, phone, bookingDate, content } = req.body;

        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }

        const booking = await restaurantBookingService.createRestaurantBooking(userId, {
            fullName,
            phone,
            bookingDate,
            content
        });

        res.status(201).json({
            message: 'Restaurant booking created successfully',
            booking
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllRestaurantBookings(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const result = await restaurantBookingService.getAllRestaurantBookings({
            page,
            pageSize
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function getRestaurantBookingById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const booking = await restaurantBookingService.getRestaurantBookingById(id);

        res.json(booking);
    } catch (error) {
        next(error);
    }
}
