import * as authService from '@/services/auth/authService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';
import { CookieOptions } from 'express';

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password, name, phone, role } = req.body;
        const user = await authService.register({ email, password, name, phone, role });
        res.status(201).json(user);
    } catch (error: any) {
        if (error.message === 'User already exists') {
            return next(new ApiError(error.message, 400));
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

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        
        // Save accessToken to HTTP-Only Cookie
        res.cookie('accessToken', result.accessToken, cookieOptions);

        res.json({
            message: result.message,
            role: result.role,
            // Return accessToken for mobile apps that can't use cookies
            accessToken: result.accessToken,
        });
    } catch (error: any) {
        next(new ApiError(error.message, 401));
    }
};

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError('Unauthorized: missing user ID', 401);
        }
        const result = await authService.refreshAccessToken({ userId });

        // Update accessToken in HTTP-Only Cookie
        res.cookie('accessToken', result.accessToken, cookieOptions);

        // Return new accessToken for mobile apps
        res.json({ 
            message: "Token refreshed",
            accessToken: result.accessToken,
        });
    } catch (error: any) {
        next(new ApiError(error.message, 403));
    }
};

export async function logout(req: Request, res: Response, next: NextFunction) {
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

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        // Try to get token from cookie first, then from Authorization header
        let accessToken = req.cookies.accessToken;
        
        if (!accessToken) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                accessToken = authHeader.substring(7);
            }
        }

        if (!accessToken) {
            return next(new ApiError('Access token not found in cookies or headers', 401));
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