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
        res.json(result);
    } catch (error) {
        next(new ApiError(error.message, 401));
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const refreshToken = authHeader && authHeader.split(' ')[1];
        if (!refreshToken) {
            return next(new ApiError('Unauthorized - Refresh token missing', 401));
        }
        const result = await authService.refreshAccessToken(refreshToken);
        res.json(result);
    } catch (error) {
        next(new ApiError(error.message, 403));
    }
};

export default {
    register,
    login,
    refreshToken,
}