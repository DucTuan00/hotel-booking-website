import * as roomAvailableService from '@/services/rooms/roomAvailableService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

export async function createRoomAvailable(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId, date, price, inventory } = req.body;
        
        if (!roomId || !date || price === undefined || inventory === undefined) {
            return next(new ApiError("Missing required fields: roomId, date, price, inventory", 400));
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return next(new ApiError("Invalid date format", 400));
        }

        const roomAvailable = await roomAvailableService.createRoomAvailable({
            roomId,
            date: parsedDate,
            price: Number(price),
            inventory: Number(inventory)
        });

        res.status(201).json(roomAvailable);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function createBulkRoomAvailable(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId, startDate, endDate, price, inventory } = req.body;
        
        if (!roomId || !startDate || !endDate || price === undefined || inventory === undefined) {
            return next(new ApiError("Missing required fields: roomId, startDate, endDate, price, inventory", 400));
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        
        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return next(new ApiError("Invalid date format", 400));
        }

        const result = await roomAvailableService.createBulkRoomAvailable({
            roomId,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            price: Number(price),
            inventory: Number(inventory)
        });

        res.status(201).json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function getRoomAvailable(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId, startDate, endDate, page = 1, pageSize = 100 } = req.query;
        
        const input: any = {
            page: parseInt(page as string),
            pageSize: parseInt(pageSize as string)
        };

        if (roomId) {
            input.roomId = roomId as string;
        }

        if (startDate) {
            const parsedStartDate = new Date(startDate as string);
            if (isNaN(parsedStartDate.getTime())) {
                return next(new ApiError("Invalid start date format", 400));
            }
            input.startDate = parsedStartDate;
        }

        if (endDate) {
            const parsedEndDate = new Date(endDate as string);
            if (isNaN(parsedEndDate.getTime())) {
                return next(new ApiError("Invalid end date format", 400));
            }
            input.endDate = parsedEndDate;
        }

        const result = await roomAvailableService.getRoomAvailable(input);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function updateRoomAvailable(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId, date } = req.params;
        const { price, inventory } = req.body;
        
        if (!roomId || !date) {
            return next(new ApiError("Missing required parameters: roomId, date", 400));
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return next(new ApiError("Invalid date format", 400));
        }

        const input: any = {
            roomId,
            date: parsedDate
        };

        if (price !== undefined) {
            input.price = Number(price);
        }

        if (inventory !== undefined) {
            input.inventory = Number(inventory);
        }

        const result = await roomAvailableService.updateRoomAvailable(input);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function deleteRoomAvailable(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId, date } = req.params;
        
        if (!roomId || !date) {
            return next(new ApiError("Missing required parameters: roomId, date", 400));
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return next(new ApiError("Invalid date format", 400));
        }

        const result = await roomAvailableService.deleteRoomAvailable(roomId, parsedDate);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function getAllRoomsAvailability(req: Request, res: Response, next: NextFunction) {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return next(new ApiError("Missing required parameters: startDate, endDate", 400));
        }

        const parsedStartDate = new Date(startDate as string);
        const parsedEndDate = new Date(endDate as string);
        
        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return next(new ApiError("Invalid date format", 400));
        }

        const result = await roomAvailableService.getAllRoomsAvailability(parsedStartDate, parsedEndDate);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};
