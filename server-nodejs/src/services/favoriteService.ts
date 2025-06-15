import Favorite from '@/models/Favorite';
import ApiError from '@/utils/apiError';

interface FavoriteInput {
    userId: string;
    roomId: string;
}

interface GetFavoritesInput {
    userId: string;
}

const addFavorite = async (args: FavoriteInput) => {
    const { userId, roomId } = args;

    if (!userId) {
        throw new ApiError('Invalid userId', 400);
    }

    if (!roomId) {
        throw new ApiError('Invalid roomId', 400);
    }

    const newFavorite = new Favorite({
        user: userId,
        room: roomId,
    });

    await newFavorite.save();

    return { message: 'Favorite added successfully' };
};

const getFavorites = async (arg: GetFavoritesInput) => {
    const { userId } = arg;

    if (!userId) {
        throw new ApiError('Invalid userId', 400);
    }

    const favorites = await Favorite.find({ user: userId }).populate('room');
    return favorites;
};

const deleteFavorite = async (args: FavoriteInput) => {
    const { userId, roomId } = args;

    if (!userId) {
        throw new ApiError('Invalid userId', 400);
    }

    if (!roomId) {
        throw new ApiError('Invalid roomId', 400);
    }

    const deletedFavorite = await Favorite.deleteOne({ user: userId, room: roomId });
    
    if (deletedFavorite.deletedCount === 0) {
        throw new ApiError('Favorite not found to delete', 404);
    }

    return { message: 'Favorite deleted successfully' };
};

export default {
    addFavorite,
    getFavorites,
    deleteFavorite,
}
