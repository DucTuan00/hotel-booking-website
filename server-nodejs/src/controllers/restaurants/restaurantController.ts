import { Request, Response, NextFunction } from 'express';
import * as restaurantService from '@/services/restaurants/restaurantService';
import ApiError from '@/utils/apiError';

export async function getRestaurantInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const restaurant = await restaurantService.getRestaurantInfo();
        res.json(restaurant);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function updateRestaurantInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const { information } = req.body;
        const updatedRestaurant = await restaurantService.updateRestaurantInfo(information);
        res.json({
            message: 'Update restaurant information successfully',
            restaurant: updatedRestaurant
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}