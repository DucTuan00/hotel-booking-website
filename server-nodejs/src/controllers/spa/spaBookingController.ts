import { Request, Response, NextFunction } from 'express';
import * as spaBookingService from '@/services/spa/spaBookingService';
import ApiError from '@/utils/apiError';

export async function createSpaBooking(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        const { fullName, phone, bookingDate, content } = req.body;

        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }

        const booking = await spaBookingService.createSpaBooking(userId, {
            fullName,
            phone,
            bookingDate,
            content
        });

        res.status(201).json({
            message: 'Spa booking created successfully',
            booking
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllSpaBookings(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const result = await spaBookingService.getAllSpaBookings({
            page,
            pageSize
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function getSpaBookingById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const booking = await spaBookingService.getSpaBookingById(id);

        res.json(booking);
    } catch (error) {
        next(error);
    }
}
