import Favorite from '../models/favoriteModel.js';

const addFavorite = async (userId, roomId) => {
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
};

const getFavorites = async (userId) => {
    if (!userId) {
        throw new Error('Invalid userId');
    }

    const favorites = await Favorite.find({ user: userId }).populate('room');
    return favorites;
};

const deleteFavorite = async (userId, roomId) => {
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
};

export default {
    addFavorite,
    getFavorites,
    deleteFavorite,
}