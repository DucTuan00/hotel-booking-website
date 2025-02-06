import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.accessExpire });
    const refreshToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.refreshExpire });

    return { accessToken, refreshToken };
};

export default generateToken;