import roomService from '@/services/roomService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, roomType, description, price, maxGuests, quantity } = req.body;
        let amenities = req.body.amenities;

        if (amenities && typeof amenities === 'string') {
            // If only one amenity was sent, it might be parsed as a string
            amenities = [amenities];
        } else if (!amenities) {
            // If no amenities were sent, ensure it's an empty array
            amenities = [];
        }
        const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

        console.log('Request Body:', req.body);

        try {
            const room = await roomService.createRoom({
                name,
                roomType,
                description,
                amenities,
                price,
                images,
                maxGuests,
                quantity,
            });

            res.status(201).json(room);
        } catch (error: any) {
            next(error);
        }

    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
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

const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const room = await roomService.getRoomById({ id });
        res.json(room);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, roomType, description, amenities, price, maxGuests, quantity } = req.body;
        const images = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

        try {
            const updatedRoom = await roomService.updateRoom({
                id,
                name,
                roomType,
                description,
                amenities,
                price,
                images,
                maxGuests,
                quantity,
            });

            res.json(updatedRoom);
        } catch (error: any) {
            next(error);
        }

    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await roomService.deleteRoom({ id });
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export default {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
};
