import RestaurantImage from '@/models/RestaurantImage';
import Restaurant from '@/models/Restaurant';
import ApiError from '@/utils/apiError';
import { mapId } from '@/utils/mapId';
import { CreateRestaurantImageInput } from '@/types/restaurant';

export async function getAllRestaurantImages() {
    let restaurant = await Restaurant.findOne();
    
    if (!restaurant) {
        restaurant = await Restaurant.create({
            information: 'Thông tin về nhà hàng sẽ được cập nhật sau.'
        });
    }

    const images = await RestaurantImage.find({ 
        restaurantId: restaurant._id,
        deletedAt: null 
    }).populate('restaurantId');
    
    return images.map(image => mapId(image));
}

export async function createRestaurantImage(data: CreateRestaurantImageInput) {
    let restaurant = await Restaurant.findOne();
    
    if (!restaurant) {
        restaurant = await Restaurant.create({
            information: 'Thông tin về nhà hàng sẽ được cập nhật sau.'
        });
    }

    if (!data.imagePath || data.imagePath.trim() === '') {
        throw new ApiError('Image path is required.', 400);
    }

    const newImage = await RestaurantImage.create({
        restaurantId: restaurant._id,
        imagePath: data.imagePath.trim(),
        title: data.title?.trim() || '',
        description: data.description?.trim() || ''
    });

    const populatedImage = await RestaurantImage.findById(newImage._id).populate('restaurantId');
    
    if (!populatedImage) {
        throw new ApiError('Failed to create restaurant image.', 500);
    }
    
    return mapId(populatedImage);
}

export async function deleteRestaurantImage(imageId: string) {
    const image = await RestaurantImage.findOne({ 
        _id: imageId, 
        deletedAt: null 
    });
    
    if (!image) {
        throw new ApiError('Restaurant image not found.', 404);
    }

    await RestaurantImage.findByIdAndUpdate(
        imageId,
        { deletedAt: new Date() },
        { new: true }
    );

    return { message: 'Restaurant image deleted successfully.' };
}
