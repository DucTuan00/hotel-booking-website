import RestaurantService from '@/models/RestaurantService';
import Restaurant from '@/models/Restaurant';
import ApiError from '@/utils/apiError';
import { mapId } from '@/utils/mapId';
import { CreateRestaurantServiceInput, UpdateRestaurantServiceInput } from '@/types/restaurant';

export async function getAllRestaurantServices(search?: string) {
    let restaurant = await Restaurant.findOne();
    
    if (!restaurant) {
        restaurant = await Restaurant.create({
            information: 'Thông tin về nhà hàng sẽ được cập nhật sau.'
        });
    }

    const query: any = { 
        restaurantId: restaurant._id,
        deletedAt: null 
    };

    if (search && search.trim()) {
        query.title = new RegExp(search.trim(), 'i'); // Case-insensitive search by title
    }

    const services = await RestaurantService.find(query).populate('restaurantId');
    
    return services.map(service => mapId(service));
}

export async function getRestaurantServiceById(serviceId: string) {
    const service = await RestaurantService.findOne({ 
        _id: serviceId, 
        deletedAt: null 
    }).populate('restaurantId');
    
    if (!service) {
        throw new ApiError('Restaurant service not found.', 404);
    }
    
    return mapId(service);
}

export async function createRestaurantService(data: CreateRestaurantServiceInput) {
    let restaurant = await Restaurant.findOne();
    
    if (!restaurant) {
        restaurant = await Restaurant.create({
            information: 'Thông tin về nhà hàng sẽ được cập nhật sau.'
        });
    }

    if (!data.title || data.title.trim() === '') {
        throw new ApiError('Title is required.', 400);
    }

    const newService = await RestaurantService.create({
        restaurantId: restaurant._id,
        title: data.title.trim(),
        description: data.description?.trim() || '',
        price: data.price || 0,
        imagePath: data.imagePath || ''
    });

    const populatedService = await RestaurantService.findById(newService._id).populate('restaurantId');
    
    if (!populatedService) {
        throw new ApiError('Failed to create restaurant service.', 500);
    }
    
    return mapId(populatedService);
}

export async function updateRestaurantService(serviceId: string, data: UpdateRestaurantServiceInput) {
    if (!data.title || data.title.trim() === '') {
        throw new ApiError('Title is required.', 400);
    }

    const service = await RestaurantService.findOne({ 
        _id: serviceId, 
        deletedAt: null 
    });
    
    if (!service) {
        throw new ApiError('Restaurant service not found.', 404);
    }

    const updatedService = await RestaurantService.findByIdAndUpdate(
        serviceId,
        {
            title: data.title.trim(),
            description: data.description?.trim() || '',
            price: data.price || 0,
            imagePath: data.imagePath || ''
        },
        { new: true }
    ).populate('restaurantId');

    if (!updatedService) {
        throw new ApiError('Failed to update restaurant service.', 500);
    }

    return mapId(updatedService);
}

export async function deleteRestaurantService(serviceId: string) {
    const service = await RestaurantService.findOne({ 
        _id: serviceId, 
        deletedAt: null 
    });
    
    if (!service) {
        throw new ApiError('Restaurant service not found.', 404);
    }

    await RestaurantService.findByIdAndUpdate(
        serviceId,
        { deletedAt: new Date() },
        { new: true }
    );

    return { message: 'Restaurant service deleted successfully.' };
}
