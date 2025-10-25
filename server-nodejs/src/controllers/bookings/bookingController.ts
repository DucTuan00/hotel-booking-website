import * as bookingService from '@/services/bookings/bookingService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

export async function createBooking(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        const { 
            roomId, 
            checkIn, 
            checkOut, 
            guests, 
            quantity,
            firstName,
            lastName,
            email,
            phoneNumber,
            paymentMethod,
            celebrateItems
        } = req.body;

        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }

        try {
            const booking = await bookingService.createBooking({
                userId, 
                roomId, 
                checkIn, 
                checkOut, 
                guests,
                quantity,
                firstName,
                lastName,
                email,
                phoneNumber,
                paymentMethod,
                celebrateItems
            });
            
            res.status(201).json(booking);
        } catch (error: any) {
            next(error);
        }
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function getBookingById(req: Request, res: Response, next: NextFunction) {
    try {
        const bookingId = req.params.id;
        const booking = await bookingService.getBookingById({ bookingId });
        res.status(200).json(booking);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function getBookingsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }
        const bookings = await bookingService.getBookingsByUserId({ userId });
        res.status(200).json(bookings);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
        const bookingId = req.params.id;
        const booking = await bookingService.cancelBooking({ bookingId });
        res.status(200).json(booking);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function getAllBookings(req: Request, res: Response, next: NextFunction) {
    try {
        const { search, status, paymentStatus, sortBy, sortOrder, page, pageSize } = req.query;
        
        const bookings = await bookingService.getAllBookings({
            search: search as any,
            status: status as any,
            paymentStatus: paymentStatus as any,
            sortBy: sortBy as any,
            sortOrder: sortOrder as any,
            page: parseInt(page as string),
            pageSize: parseInt(pageSize as string)
        });
        
        res.json(bookings);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function updateBooking(req: Request, res: Response, next: NextFunction) {
    try {
        const bookingId = req.params.id;
        const { status } = req.body; 

        const updatedBooking = await bookingService.updateBooking({ bookingId, status });
        res.json(updatedBooking);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function previewBookingPrice(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId, checkIn, checkOut, quantity, celebrateItems } = req.query;

        if (!roomId || !checkIn || !checkOut || !quantity) {
            throw new ApiError('Missing required parameters: roomId, checkIn, checkOut, quantity', 400);
        }

        // Parse celebrateItems from JSON string if provided
        let parsedCelebrateItems;
        if (celebrateItems) {
            try {
                parsedCelebrateItems = JSON.parse(celebrateItems as string);
            } catch {
                throw new ApiError('Invalid celebrateItems format', 400);
            }
        }

        const pricePreview = await bookingService.previewBookingPrice({
            roomId: roomId as string,
            checkIn: checkIn as string,
            checkOut: checkOut as string,
            quantity: parseInt(quantity as string),
            celebrateItems: parsedCelebrateItems
        });

        res.json(pricePreview);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}
