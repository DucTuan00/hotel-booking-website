import Restaurant from '@/models/Restaurant';
import ApiError from '@/utils/apiError';
import { mapId } from '@/utils/mapId';

export async function getRestaurantInfo() {
    let restaurant = await Restaurant.findOne();
    
    if (!restaurant) {
        restaurant = await Restaurant.create({
            information: 'Thông tin về nhà hàng sẽ được cập nhật sau.'
        });
    }
    
    return mapId(restaurant);
}

export async function updateRestaurantInfo(information: string) {
    if (!information || typeof information !== 'string' || information.trim() === '') {
        throw new ApiError('Restaurant information can not empty.', 400);
    }

    let restaurant = await Restaurant.findOneAndUpdate(
        {}, // Find the single restaurant document
        { information: information.trim() },
        { new: true, upsert: true }
    );

    return mapId(restaurant);
}