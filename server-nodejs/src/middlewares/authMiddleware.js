import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Token missing' });
        }

        jwt.verify(token, jwtConfig.secret, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden - Invalid token' });
            }

            // Kiểm tra quyền nếu cần
            if (roles.length > 0 && !roles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden - Insufficient role' });
            }

            req.user = user;
            next();
        });
    };
};

export default authMiddleware;