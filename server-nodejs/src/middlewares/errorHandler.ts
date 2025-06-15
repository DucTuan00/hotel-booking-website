import { Request, Response, NextFunction } from 'express';
import ApiError from '@/utils/apiError';

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    const statusCode: number = err.statusCode || 500;
    const message: string = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        message: message,
    });
};

export default errorHandler;
