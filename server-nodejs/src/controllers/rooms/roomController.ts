import * as roomService from '@/services/rooms/roomService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

export async function createRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, roomType, description, price, maxGuests, quantity, roomArea, amenities, images } = req.body;

        console.log('Request Body:', req.body);

        try {
            const room = await roomService.createRoom({
                name,
                roomType,
                description,
                amenities: amenities || [],
                price,
                images: images || [],
                maxGuests,
                quantity,
                roomArea,
            });

            res.status(201).json(room);
        } catch (error: any) {
            next(error);
        }

    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function getAllRooms(req: Request, res: Response, next: NextFunction) {
    try {
        const { page = 1, pageSize = 10, ...filter } = req.query;
        const result = await roomService.getAllRooms({
            filter,
            page: parseInt(page as string),
            pageSize: parseInt(pageSize as string)
        });
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function getAllRoomsWithoutPagination(req: Request, res: Response, next: NextFunction) {
    try {
        const rooms = await roomService.getAllRoomsWithoutPagination();
        res.json(rooms);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function getActiveRooms(req: Request, res: Response, next: NextFunction) {
    try {
        const { page = 1, pageSize = 10, ...filter } = req.query;
        const result = await roomService.getActiveRooms({
            filter,
            page: parseInt(page as string),
            pageSize: parseInt(pageSize as string)
        });
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function getRoomById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const room = await roomService.getRoomById({ id });
        res.json(room);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { name, roomType, description, price, maxGuests, quantity, roomArea, amenities, images } = req.body;

        try {
            const updatedRoom = await roomService.updateRoom({
                id,
                name,
                roomType,
                description,
                amenities: amenities || [],
                price,
                images: images || [],
                maxGuests,
                quantity,
                roomArea,
            });

            res.json(updatedRoom);
        } catch (error: any) {
            next(error);
        }

    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function deleteRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await roomService.deleteRoom({ id });
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function deleteRoomImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { imageId } = req.params;
        const result = await roomService.deleteRoomImage(imageId);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export async function toggleRoomActive(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await roomService.toggleRoomActive({ id });
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};
