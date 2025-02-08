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

    return {
        message: 'Login successfully',
        _id: user._id,
        accessToken,
        refreshToken,
    };
};

const refreshAccessToken = async (refreshToken) => {
    const user = jwt.verify(refreshToken, jwtConfig.secret);
    const foundUser = await User.findById(user.id);

    if (!foundUser) {
        throw new Error('User not found');
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(foundUser);
    return { accessToken, refreshToken: newRefreshToken };
};

export default {
    register,
    login,
    refreshAccessToken,
}