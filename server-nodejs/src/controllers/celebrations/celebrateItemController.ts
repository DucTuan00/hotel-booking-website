import { Request, Response, NextFunction } from 'express';
import * as celebrateItemService from '@/services/celebrations/celebrateItemService';
import ApiError from '@/utils/apiError';

export async function getAllCelebrateItems(req: Request, res: Response, next: NextFunction) {
    try {
        const { search } = req.query;
        const items = await celebrateItemService.getAllCelebrateItems(search as string);
        res.json({
            items,
            total: items.length
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function getCelebrateItemById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const item = await celebrateItemService.getCelebrateItemById(id);
        res.json(item);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function createCelebrateItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, price, imagePath } = req.body;

        const newItem = await celebrateItemService.createCelebrateItem({
            name,
            description,
            price: price ? Number(price) : 0,
            imagePath: imagePath || ''
        });
        res.status(201).json({
            message: 'Celebrate item created successfully',
            item: newItem
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function updateCelebrateItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { name, description, price, imagePath } = req.body;

        const updatedItem = await celebrateItemService.updateCelebrateItem(id, {
            id,
            name,
            description,
            price: price ? Number(price) : 0,
            imagePath: imagePath || ''
        });
        res.json({
            message: 'Celebrate item updated successfully',
            item: updatedItem
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function deleteCelebrateItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const result = await celebrateItemService.deleteCelebrateItem(id);
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}
