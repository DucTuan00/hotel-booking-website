import CelebrateItem from '@/models/CelebrateItem';
import ApiError from '@/utils/apiError';
import { mapId } from '@/utils/mapId';
import { CreateCelebrateItemInput, UpdateCelebrateItemInput } from '@/types/celebrate';

export async function getAllCelebrateItems(search?: string) {
    const query: any = {};

    if (search && search.trim()) {
        query.name = new RegExp(search.trim(), 'i'); // Case-insensitive search by name
    }

    const items = await CelebrateItem.find(query);
    
    return items.map(item => mapId(item));
}

export async function getCelebrateItemById(itemId: string) {
    const item = await CelebrateItem.findById(itemId);
    
    if (!item) {
        throw new ApiError('Celebrate item not found.', 404);
    }
    
    return mapId(item);
}

export async function createCelebrateItem(data: CreateCelebrateItemInput) {
    if (!data.name || data.name.trim() === '') {
        throw new ApiError('Name is required.', 400);
    }

    if (data.price === undefined || data.price < 0) {
        throw new ApiError('Valid price is required.', 400);
    }

    const newItem = await CelebrateItem.create({
        name: data.name.trim(),
        description: data.description?.trim() || '',
        price: data.price,
        imagePath: data.imagePath || ''
    });

    const createdItem = await CelebrateItem.findById(newItem._id);
    
    if (!createdItem) {
        throw new ApiError('Failed to create celebrate item.', 500);
    }
    
    return mapId(createdItem);
}

export async function updateCelebrateItem(itemId: string, data: UpdateCelebrateItemInput) {
    const item = await CelebrateItem.findById(itemId);
    
    if (!item) {
        throw new ApiError('Celebrate item not found.', 404);
    }

    if (!data.name || data.name.trim() === '') {
        throw new ApiError('Name is required.', 400);
    }

    if (data.price === undefined || data.price < 0) {
        throw new ApiError('Valid price is required.', 400);
    }

    item.name = data.name.trim();
    item.description = data.description?.trim() || '';
    item.price = data.price;
    item.imagePath = data.imagePath || '';

    await item.save();
    
    const updatedItem = await CelebrateItem.findById(itemId);
    
    if (!updatedItem) {
        throw new ApiError('Failed to update celebrate item.', 500);
    }
    
    return mapId(updatedItem);
}

export async function deleteCelebrateItem(itemId: string) {
    const item = await CelebrateItem.findById(itemId);
    
    if (!item) {
        throw new ApiError('Celebrate item not found.', 404);
    }

    await CelebrateItem.findByIdAndDelete(itemId);
    
    return { message: 'Celebrate item deleted successfully.' };
}
