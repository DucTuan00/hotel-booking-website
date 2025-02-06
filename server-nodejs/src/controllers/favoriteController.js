import favoriteService from '../services/favoriteService.js';
import ApiError from '../utils/apiError.js';

const addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id; // Get user id from req.user
        const { roomId } = req.body;
        const result = await favoriteService.addFavorite(userId, roomId);
        res.status(201).json(result);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const getFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const favorites = await favoriteService.getFavorites(userId);
        res.json(favorites);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

const deleteFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { roomId } = req.params;
        const result = await favoriteService.deleteFavorite(userId, roomId);
        res.json(result);
    } catch (error) {
        next(new ApiError(error.message, 400));
    }
};

export default {
    addFavorite,
    getFavorites,
    deleteFavorite,
};