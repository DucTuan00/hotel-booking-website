import authService from '../services/authService.js';
import ApiError from '../utils/apiError.js';

const register = async (req, res, next) => {
    try {
        const { email, password, name, phone, role } = req.body;
        const user = await authService.register(email, password, name, phone, role);
        res.status(201).json(user);
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(400).json({ error: error.message });
        }
        next(new ApiError(error.message, 400));
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        // Save accessToken to HTTP-Only Cookie
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.json({
            message: result.message,
            role: result.role,
        });
    } catch (error) {
        next(new ApiError(error.message, 401));
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await authService.refreshAccessToken(userId);

        // Update accessToken in HTTP-Only Cookie
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // Return new refreshToken
        res.json({ message: "Token refreshed" });
    } catch (error) {
        next(new ApiError(error.message, 403));
    }
};

const logout = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await authService.logout(userId);

        // Delete accessToken in cookie when logout
        res.clearCookie('accessToken');
        res.json(result);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

export default {
    register,
    login,
    refreshToken,
    logout,
}