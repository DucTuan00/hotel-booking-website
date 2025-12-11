import Favorite from '@/models/Favorite';
import ApiError from '@/utils/apiError';
import {
    FavoriteInput,
    GetFavoritesInput
} from '@/types/favorite';

export async function addFavorite(args: FavoriteInput) {
    const { userId, roomId } = args;

    if (!userId) {
        throw new ApiError('Invalid userId', 400);
    }

    if (!roomId) {
        throw new ApiError('Invalid roomId', 400);
    }

    const newFavorite = new Favorite({
        userId: userId,
        roomId: roomId,
    });

    await newFavorite.save();

    return { message: 'Favorite added successfully' };
};

export async function getFavorites(arg: GetFavoritesInput) {
    const { userId } = arg;

    if (!userId) {
        throw new ApiError('Invalid userId', 400);
    }

    const favorites = await Favorite.find({ userId: userId }).populate('room');
    return favorites;
};

export async function deleteFavorite(args: FavoriteInput) {
    const { userId, roomId } = args;

    if (!userId) {
        throw new ApiError('Invalid userId', 400);
    }

    if (!roomId) {
        throw new ApiError('Invalid roomId', 400);
    }

    const deletedFavorite = await Favorite.deleteOne({ userId: userId, roomId: roomId });
    
    if (deletedFavorite.deletedCount === 0) {
        throw new ApiError('Favorite not found to delete', 404);
    }

    return { message: 'Favorite deleted successfully' };
};
