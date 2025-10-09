import { Request, Response, NextFunction } from 'express';
import * as restaurantImageService from '@/services/restaurants/restaurantImageService';
import ApiError from '@/utils/apiError';

export async function getAllRestaurantImages(req: Request, res: Response, next: NextFunction) {
    try {
        const images = await restaurantImageService.getAllRestaurantImages();
        res.json({
            images,
            total: images.length
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function createRestaurantImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { imagePath, title, description } = req.body;
        const newImage = await restaurantImageService.createRestaurantImage({
            imagePath,
            title,
            description
        });
        res.status(201).json({
            message: 'Restaurant image created successfully',
            image: newImage
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function deleteRestaurantImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await restaurantImageService.deleteRestaurantImage(id);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}
