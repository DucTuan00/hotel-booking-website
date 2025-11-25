import { Request, Response, NextFunction } from 'express';
import ApiError from '@/utils/apiError';

export default function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
    const statusCode: number = err.statusCode || 500;
    const message: string = err.message || 'Internal Server Error';

    if (statusCode >= 500) {
        // Server errors: log full stack trace
        console.error('[SERVER ERROR]', err);
    } else if (statusCode === 401 || statusCode === 403) {
        // Auth errors: log only message and endpoint for debugging
        console.log(`[AUTH] ${statusCode} - ${message} | ${req.method} ${req.originalUrl}`);
    } else {
        // Other client errors: log with warning
        console.warn(`[CLIENT ERROR] ${statusCode} - ${message} | ${req.method} ${req.originalUrl}`);
    }

    res.status(statusCode).json({
        message: message,
    });
};