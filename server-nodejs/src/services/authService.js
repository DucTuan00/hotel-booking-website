import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

const register = async (email, password, name, phone, role) => {
    try {
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
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            throw new Error('User already exists');
        }
        throw new Error('Error registering user');
    }
};

const login = async (email, password) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const { accessToken, refreshToken } = generateToken(user);

        return {
            message: 'Login successfully',
            _id: user._id,
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error logging in');
    }
};

const refreshAccessToken = async (refreshToken) => {
    try {
        const user = jwt.verify(refreshToken, jwtConfig.secret);
        const foundUser = await User.findById(user.id);

        if (!foundUser) {
            throw new Error('User not found');
        }

        const { accessToken, refreshToken: newRefreshToken } = generateToken(foundUser);
        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        console.error(error);
        throw new Error('Invalid refresh token');
    }
};

export default {
    register,
    login,
    refreshAccessToken,
}