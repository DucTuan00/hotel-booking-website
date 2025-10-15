import { Request, Response, NextFunction } from 'express';
import ApiError from '@/utils/apiError';
import {
    uploadImageToCloudinary,
    uploadMultipleImagesToCloudinary,
    deleteImageFromCloudinary,
} from '@/services/upload/cloudinaryService';

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            throw new ApiError('No file uploaded', 400);
        }

        const result = await uploadImageToCloudinary(req.file.buffer);

        res.json({
            message: 'Image uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function uploadMultipleImages(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw new ApiError('No files uploaded', 400);
        }

        const fileBuffers = req.files.map((file) => file.buffer);
        
        const results = await uploadMultipleImagesToCloudinary(fileBuffers);

        res.json({
            message: 'Images uploaded successfully',
            data: results.map((result) => ({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
            })),
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { publicId } = req.body;

        if (!publicId) {
            throw new ApiError('publicId is required', 400);
        }

        await deleteImageFromCloudinary(publicId);

        res.json({
            message: 'Image deleted successfully',
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}