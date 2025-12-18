import bcrypt from 'bcryptjs';
import User from '@/models/User';
import generateToken from '@/utils/generateToken';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwtConfig from '@/config/jwt';
import {
    RegisterInput,
    LoginInput,
    UserIdInput,
    AccessTokenInput
} from '@/types/auth';

export async function register(args: RegisterInput) {
    const { email, password, name, phone, role } = args;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email đã được đăng ký');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        password: hashedPassword,
        name,
        phone,
        role
    });

    try {
        await newUser.save();
    } catch (error: any) {
        // Handle MongoDB duplicate key error (race condition)
        if (error.code === 11000) {
            throw new Error('Email đã được đăng ký');
        }
        throw error;
    }

    return {
        message: 'User register successfully'
    };
};

export async function login(args: LoginInput) {
    const { email, password } = args;

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Tài khoản hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Sai mật khẩu');
    }

    const { accessToken, refreshToken } = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    return {
        message: 'Login successfully',
        id: user._id,
        role: user.role,
        accessToken,
        refreshToken,
    };
};

export async function refreshAccessToken(refreshToken: string) {
    let decoded: any;
    try {
        decoded = jwt.verify(refreshToken, jwtConfig.secret as string) as JwtPayload;
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            throw new Error('Refresh token expired');
        }
        throw new Error('Invalid refresh token');
    }

    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user || !user.active) {
        throw new Error('User not found or inactive');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    return { 
        accessToken, 
        refreshToken: newRefreshToken 
    };
}

export async function logout(arg: UserIdInput) {
    const { userId } = arg;

    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    return { message: 'Logged out successfully' };
};

export async function verifyAccessToken(arg: AccessTokenInput) {
    const { accessToken } = arg;

    const decoded = jwt.verify(accessToken, jwtConfig.secret as string) as JwtPayload;
    const userId = (decoded as JwtPayload).id;
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('Invalid access token - User not found');
    }

    return {
        id: user._id,
        role: user.role,
    };
};

export async function generateTokensForUser(user: any) {
    const { accessToken, refreshToken } = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    return {
        accessToken,
        refreshToken,
        id: user._id,
        role: user.role,
    };
};
