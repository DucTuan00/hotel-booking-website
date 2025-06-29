import authService from '@/services/authService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';
import { CookieOptions } from 'express';

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, phone, role } = req.body;
        const user = await authService.register({ email, password, name, phone, role });
        res.status(201).json(user);
    } catch (error: any) {
        if (error.message === 'User already exists') {
            return res.status(400).json({ error: error.message });
        }
        next(new ApiError(error.message, 400));
    }
};

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        
        // Save accessToken to HTTP-Only Cookie
        res.cookie('accessToken', result.accessToken, cookieOptions);

        res.json({
            message: result.message,
            role: result.role,
        });
    } catch (error: any) {
        next(new ApiError(error.message, 401));
    }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }
        const result = await authService.refreshAccessToken({ userId });

        // Update accessToken in HTTP-Only Cookie
        res.cookie('accessToken', result.accessToken, cookieOptions);

        // Return new refreshToken
        res.json({ message: "Token refreshed" });
    } catch (error: any) {
        next(new ApiError(error.message, 403));
    }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }
        const result = await authService.logout({ userId });

        // Delete accessToken in cookie when logout
        res.clearCookie('accessToken');
        res.json(result);
    } catch (error: any) {
        next(new ApiError(error.message, 400));
    }
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken; //get token from cookie

        if (!accessToken) {
            return next(new ApiError('Access token not found in headers', 401));
        }

        const userData = await authService.verifyAccessToken({ accessToken });

        res.json({
            message: 'Access token verified successfully',
            userId: userData.id,
            role: userData.role,
        });

    } catch (error: any) {
        if (error.message === 'Access token expired') {
            return next(new ApiError('Access token expired', 401)); 
        } else if (error.message.startsWith('Invalid access token')) {
            return next(new ApiError('Invalid access token', 401)); 
        } else {
            next(new ApiError(error.message, 500));
        }
    }
};

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default {
    register,
    login,
    refreshToken,
    logout,
    verifyToken,
} as Record<string, Controller>;
