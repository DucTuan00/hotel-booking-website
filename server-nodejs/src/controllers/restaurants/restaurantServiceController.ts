import { Request, Response, NextFunction } from 'express';
import * as restaurantServiceService from '@/services/restaurants/restaurantServiceService';
import ApiError from '@/utils/apiError';

export async function getAllRestaurantServices(req: Request, res: Response, next: NextFunction) {
    try {
        const { search } = req.query;
        const services = await restaurantServiceService.getAllRestaurantServices(search as string);
        res.json({
            services,
            total: services.length
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function getRestaurantServiceById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const service = await restaurantServiceService.getRestaurantServiceById(id);
        res.json(service);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function createRestaurantService(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, description, price, imagePath } = req.body;

        const newService = await restaurantServiceService.createRestaurantService({
            title,
            description,
            price: price ? Number(price) : 0,
            imagePath: imagePath || ''
        });
        res.status(201).json({
            message: 'Restaurant service created successfully',
            service: newService
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function updateRestaurantService(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { title, description, price, imagePath } = req.body;

        const updatedService = await restaurantServiceService.updateRestaurantService(id, {
            id,
            title,
            description,
            price: price ? Number(price) : 0,
            imagePath: imagePath || ''
        });
        res.json({
            message: 'Restaurant service updated successfully',
            service: updatedService
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function deleteRestaurantService(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await restaurantServiceService.deleteRestaurantService(id);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}
