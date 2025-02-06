import Favorite from '../models/favoriteModel.js';

const addFavorite = async (userId, roomId) => {
    try {
        if (!userId) {
            throw new Error('Invalid userId');
        }
        if (!roomId) {
            throw new Error('Invalid roomId');
        }

        const newFavorite = new Favorite({
            user: userId,
            room: roomId,
        });
        await newFavorite.save();
        return { message: 'Favorite added successfully' };
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            throw new Error('This room has already added to your favorite');
        }
        throw new Error(error.message || 'Error adding favorite');
    }
};

const getFavorites = async (userId) => {
    try {
        if (!userId) {
            throw new Error('Invalid userId');
        }

        const favorites = await Favorite.find({ user: userId }).populate('room');
        return favorites;
    } catch (error) {
         console.error(error);
        throw new Error(error.message || 'Error getting favorite');
    }
};

const deleteFavorite = async (userId, roomId) => {
    try {
        if (!userId) {
            throw new Error('Invalid userId');
        }
        if (!roomId) {
            throw new Error('Invalid roomId');
        }

        const deletedFavorite = await Favorite.deleteOne({ user: userId, room: roomId });
        if (deletedFavorite.deletedCount === 0) {
            throw new Error('Favorite not found to delete');
        }

        return { message: 'Favorite deleted successfully' };
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error deleting favorite');
    }
};

export default {
    addFavorite,
    getFavorites,
    deleteFavorite,
}