import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

const register = async (email, password, name, phone, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        password: hashedPassword,
        name,
        phone,
        role
    });
    const user = await newUser.save();
    return {
        message: 'User register successfully',
        user
    };
};

const login = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const { accessToken, refreshToken } = generateToken(user);

    // Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    return {
        message: 'Login successfully',
        _id: user._id,
        accessToken,
        refreshToken,
    };
};

const refreshAccessToken = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Get refreshToken from database
    const storedRefreshToken = user.refreshToken;

    if (!storedRefreshToken) {
        throw new Error('No refresh token found');
    }

    jwt.verify(storedRefreshToken, jwtConfig.secret);

    const { accessToken, refreshToken: newRefreshToken } = generateToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.refreshToken = null;
    await user.save();
    return { message: 'Logged out successfully' };
};

export default {
    register,
    login,
    refreshAccessToken,
    logout,
}