import { Request, Response, NextFunction } from 'express';
import * as spaServiceService from '@/services/spa/spaServiceService';
import ApiError from '@/utils/apiError';

export async function getAllSpaServices(req: Request, res: Response, next: NextFunction) {
    try {
        const { search } = req.query;
        const services = await spaServiceService.getAllSpaServices(search as string);
        res.json({
            services,
            total: services.length
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function getSpaServiceById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const service = await spaServiceService.getSpaServiceById(id);
        res.json(service);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function createSpaService(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, description, price, imagePath } = req.body;

        const newService = await spaServiceService.createSpaService({
            title,
            description,
            price: price ? Number(price) : 0,
            imagePath: imagePath || ''
        });
        res.status(201).json({
            message: 'Spa service created successfully',
            service: newService
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function updateSpaService(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { title, description, price, imagePath } = req.body;

        const updatedService = await spaServiceService.updateSpaService(id, {
            id,
            title,
            description,
            price: price ? Number(price) : 0,
            imagePath: imagePath || ''
        });
        res.json({
            message: 'Spa service updated successfully',
            service: updatedService
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function deleteSpaService(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await spaServiceService.deleteSpaService(id);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}