import SpaImage from '@/models/SpaImage';
import Spa from '@/models/Spa';
import ApiError from '@/utils/apiError';
import { mapId } from '@/utils/mapId';
import { CreateSpaImageInput } from '@/types/spa';

export async function getAllSpaImages() {
    let spa = await Spa.findOne();
    
    if (!spa) {
        spa = await Spa.create({
            information: 'Thông tin về spa sẽ được cập nhật sau.'
        });
    }

    const images = await SpaImage.find({ 
        spaId: spa._id,
        deletedAt: null 
    }).populate('spaId');
    
    return images.map((image: any) => mapId(image));
}

export async function createSpaImage(data: CreateSpaImageInput) {
    let spa = await Spa.findOne();
    
    if (!spa) {
        spa = await Spa.create({
            information: 'Thông tin về spa sẽ được cập nhật sau.'
        });
    }

    if (!data.imagePath || data.imagePath.trim() === '') {
        throw new ApiError('Image path is required.', 400);
    }

    const newImage = await SpaImage.create({
        spaId: spa._id,
        imagePath: data.imagePath.trim(),
        title: data.title?.trim() || '',
        description: data.description?.trim() || ''
    });

    const populatedImage = await SpaImage.findById(newImage._id).populate('spaId');
    
    if (!populatedImage) {
        throw new ApiError('Failed to create spa image.', 500);
    }
    
    return mapId(populatedImage);
}

export async function deleteSpaImage(imageId: string) {
    const image = await SpaImage.findOne({ 
        _id: imageId, 
        deletedAt: null 
    });
    
    if (!image) {
        throw new ApiError('Spa image not found.', 404);
    }

    image.deletedAt = new Date();
    await image.save();
    
    return { message: 'Spa image deleted successfully.' };
}