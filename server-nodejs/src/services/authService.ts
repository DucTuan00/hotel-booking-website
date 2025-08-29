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

const register = async (args: RegisterInput) => {
    const { email, password, name, phone, role } = args;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        password: hashedPassword,
        name,
        phone,
        role
    });

    await newUser.save();

    return {
        message: 'User register successfully'
    };
};

const login = async (args: LoginInput) => {
    const { email, password } = args;

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const { accessToken, refreshToken } = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    // Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    return {
        message: 'Login successfully',
        id: user._id,
        role: user.role,
        accessToken,
        refreshToken,
    };
};

const refreshAccessToken = async (arg: UserIdInput) => {
    const { userId } = arg;
    
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Get refreshToken from database
    const storedRefreshToken = user.refreshToken;

    if (!storedRefreshToken) {
        throw new Error('No refresh token found');
    }

    jwt.verify(storedRefreshToken, jwtConfig.secret as string);

    const { accessToken, refreshToken: newRefreshToken } = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (arg: UserIdInput) => {
    const { userId } = arg;

    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    user.refreshToken = undefined;

    await user.save();

    return { message: 'Logged out successfully' };
};

const verifyAccessToken = async (arg: AccessTokenInput) => {
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

export default {
    register,
    login,
    refreshAccessToken,
    logout,
    verifyAccessToken,
}
