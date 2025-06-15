import favoriteService from '@/services/favoriteService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

const addFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string | undefined = req.user?.id; // Get user id from req.user
        const { roomId } = req.body;
        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }
        const result = await favoriteService.addFavorite({ userId, roomId });
        res.status(201).json(result);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string | undefined = req.user?.id;
        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }
        const favorites = await favoriteService.getFavorites({ userId });
        res.json(favorites);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

const deleteFavorite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string | undefined = req.user?.id;
        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }
        const { roomId } = req.params;
        const result = await favoriteService.deleteFavorite({ userId, roomId });
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

export default {
    addFavorite,
    getFavorites,
    deleteFavorite,
};
