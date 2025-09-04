import jwt from 'jsonwebtoken';
import jwtConfig from '@/config/jwt';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const authMiddleware = (roles: string[] = []): RequestHandler => {
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
            res.status(401).json({ message: 'Unauthorized - Token missing' });
            return;
        }

        jwt.verify(token, jwtConfig.secret as string, (err: any, user: any) => {
            if (err) {
                res.status(403).json({ message: 'Forbidden - Invalid token' });
                return;
            }

            // Check role
            if (roles.length > 0 && !roles.includes(user.role)) {
                res.status(403).json({ message: 'Forbidden - Insufficient role' });
                return;
            }

            req.user = { id: user.id, role: user.role };
            next();
        });
    };
};

export default authMiddleware;
