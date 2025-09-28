import jwt from 'jsonwebtoken';
import jwtConfig from '@/config/jwt';
import ApiError from '@/utils/apiError';
import { UserRole } from "@/types/user";
import { Request, Response, NextFunction, RequestHandler } from 'express';

export default function authMiddleware(roles: UserRole[] = []): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Try to get token from cookie first, then from Authorization header
        let token = req.cookies.accessToken;
        
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return next(new ApiError('Unauthorized - Token missing', 401));
        }

        jwt.verify(token, jwtConfig.secret as string, (err: any, user: any) => {
            if (err) {
                return next(new ApiError('Forbidden - Invalid token', 403));
            }

            // Check role
            if (roles.length > 0 && !roles.includes(user.role as UserRole)) {
                return next(new ApiError('Forbidden - Insufficient role', 403));
            }

            req.user = { 
                id: user.id, 
                role: user.role as UserRole
            };
            next();
        });
    };
}