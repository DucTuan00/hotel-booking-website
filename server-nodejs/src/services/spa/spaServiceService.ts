import SpaService from '@/models/SpaService';
import Spa from '@/models/Spa';
import ApiError from '@/utils/apiError';
import { mapId } from '@/utils/mapId';
import { CreateSpaServiceInput, UpdateSpaServiceInput } from '@/types/spa';

export async function getAllSpaServices(search?: string) {
    let spa = await Spa.findOne();
    
    if (!spa) {
        spa = await Spa.create({
            information: 'Thông tin về spa sẽ được cập nhật sau.'
        });
    }

    const query: any = { 
        spaId: spa._id,
        deletedAt: null 
    };

    if (search && search.trim()) {
        query.title = new RegExp(search.trim(), 'i'); // Case-insensitive search by title
    }

    const services = await SpaService.find(query).populate('spaId');
    
    return services.map((service: any) => mapId(service));
}

export async function getSpaServiceById(serviceId: string) {
    const service = await SpaService.findOne({ 
        _id: serviceId, 
        deletedAt: null 
    }).populate('spaId');
    
    if (!service) {
        throw new ApiError('Spa service not found.', 404);
    }
    
    return mapId(service);
}

export async function createSpaService(data: CreateSpaServiceInput) {
    let spa = await Spa.findOne();
    
    if (!spa) {
        spa = await Spa.create({
            information: 'Thông tin về spa sẽ được cập nhật sau.'
        });
    }

    if (!data.title || data.title.trim() === '') {
        throw new ApiError('Title is required.', 400);
    }

    const newService = await SpaService.create({
        spaId: spa._id,
        title: data.title.trim(),
        description: data.description?.trim() || '',
        price: data.price || 0,
        imagePath: data.imagePath || ''
    });

    const populatedService = await SpaService.findById(newService._id).populate('spaId');
    
    if (!populatedService) {
        throw new ApiError('Failed to create spa service.', 500);
    }
    
    return mapId(populatedService);
}

export async function updateSpaService(serviceId: string, data: UpdateSpaServiceInput) {
    const service = await SpaService.findOne({ 
        _id: serviceId, 
        deletedAt: null 
    });
    
    if (!service) {
        throw new ApiError('Spa service not found.', 404);
    }

    if (!data.title || data.title.trim() === '') {
        throw new ApiError('Title is required.', 400);
    }

    service.title = data.title.trim();
    service.description = data.description?.trim() || '';
    service.price = data.price || 0;
    service.imagePath = data.imagePath || '';
    
    await service.save();
    
    const populatedService = await SpaService.findById(service._id).populate('spaId');
    
    if (!populatedService) {
        throw new ApiError('Failed to update spa service.', 500);
    }
    
    return mapId(populatedService);
}

export async function deleteSpaService(serviceId: string) {
    const service = await SpaService.findOne({ 
        _id: serviceId, 
        deletedAt: null 
    });
    
    if (!service) {
        throw new ApiError('Spa service not found.', 404);
    }

    service.deletedAt = new Date();
    await service.save();
    
    return { message: 'Spa service deleted successfully.' };
}