import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        let token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Token missing' });
        }

        jwt.verify(token, jwtConfig.secret, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden - Invalid token' });
            }

            // Check role
            if (roles.length > 0 && !roles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden - Insufficient role' });
            }

            req.user = user;
            next();
        });
    };
};

export default authMiddleware;