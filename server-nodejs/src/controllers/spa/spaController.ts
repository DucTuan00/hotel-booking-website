import { Request, Response, NextFunction } from 'express';
import * as spaService from '@/services/spa/spaService';
import ApiError from '@/utils/apiError';

export async function getSpaInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const spa = await spaService.getSpaInfo();
        res.json(spa);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function updateSpaInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const { information } = req.body;
        const updatedSpa = await spaService.updateSpaInfo(information);
        res.json({
            message: 'Update spa information successfully',
            spa: updatedSpa
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}