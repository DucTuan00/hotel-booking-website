import * as roomSearchService from '@/services/rooms/roomSearchService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

export async function searchAvailableRooms(req: Request, res: Response, next: NextFunction) {
    try {
        const { 
            checkIn, 
            checkOut, 
            guests,
            roomType,
            minPrice,
            maxPrice,
            amenities,
            page = 1,
            pageSize = 10
        } = req.query;

        // Validate dates if provided
        let parsedCheckIn: Date | undefined;
        let parsedCheckOut: Date | undefined;

        if (checkIn && checkOut) {
            parsedCheckIn = new Date(checkIn as string);
            parsedCheckOut = new Date(checkOut as string);

            if (isNaN(parsedCheckIn.getTime()) || isNaN(parsedCheckOut.getTime())) {
                return next(new ApiError("Invalid date format", 400));
            }

            if (parsedCheckIn >= parsedCheckOut) {
                return next(new ApiError("Check-in date must be before check-out date", 400));
            }

            // Validate date range (max 30 days in future)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const maxDate = new Date(today);
            maxDate.setDate(maxDate.getDate() + 30);

            if (parsedCheckIn < today) {
                return next(new ApiError("Check-in date cannot be in the past", 400));
            }

            if (parsedCheckOut > maxDate) {
                return next(new ApiError("Check-out date cannot be more than 30 days from today", 400));
            }
        }

        const result = await roomSearchService.searchAvailableRooms({
            checkIn: parsedCheckIn,
            checkOut: parsedCheckOut,
            guests: guests ? parseInt(guests as string) : undefined,
            roomType: roomType as any,
            minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
            amenities: amenities ? (amenities as string).split(',') : undefined,
            page: parseInt(page as string),
            pageSize: parseInt(pageSize as string)
        });

        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}
