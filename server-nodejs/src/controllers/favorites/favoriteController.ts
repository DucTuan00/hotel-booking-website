import * as favoriteService from '@/services/favorites/favoriteService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

export async function addFavorite(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id; // Get user id from req.user
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

export async function getFavorites(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }
        const favorites = await favoriteService.getFavorites({ userId });
        res.json(favorites);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

export async function deleteFavorite(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
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
