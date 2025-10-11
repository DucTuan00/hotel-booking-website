import { Request, Response, NextFunction } from 'express';
import * as spaImageService from '@/services/spa/spaImageService';
import ApiError from '@/utils/apiError';

export async function getAllSpaImages(req: Request, res: Response, next: NextFunction) {
    try {
        const images = await spaImageService.getAllSpaImages();
        res.json({
            images,
            total: images.length
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function createSpaImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { imagePath, title, description } = req.body;

        if (!imagePath) {
            throw new ApiError('Image path is required.', 400);
        }

        const newImage = await spaImageService.createSpaImage({
            imagePath,
            title: title || '',
            description: description || ''
        });

        res.status(201).json({
            message: 'Spa image created successfully',
            image: newImage
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function deleteSpaImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await spaImageService.deleteSpaImage(id);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}