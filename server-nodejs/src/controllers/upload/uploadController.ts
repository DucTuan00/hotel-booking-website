import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import ApiError from '@/utils/apiError';

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            throw new ApiError('No file uploaded', 400);
        }

        // Return the file path relative to public folder
        const filePath = req.file.path;
        
        res.json({
            message: 'Image uploaded successfully',
            url: filePath,
            filename: req.file.filename
        });
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { filename } = req.params;
        
        if (!filename) {
            throw new ApiError('Filename is required', 400);
        }

        const filePath = path.join('public/uploads', filename);
        
        // Check if file exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ message: 'Image deleted successfully' });
        } else {
            throw new ApiError('File not found', 404);
        }
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
}