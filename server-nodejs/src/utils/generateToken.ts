import jwt from 'jsonwebtoken';
import jwtConfig from '@/config/jwt';

interface UserPayload {
    id: string;
    email: string;
    role: string;
}

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

const generateToken = (user: UserPayload): TokenPair => {
    const payload: UserPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.accessExpire as any });
    const refreshToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.refreshExpire as any });

    return { accessToken, refreshToken };
};

export default generateToken;
