import Spa from '@/models/Spa';
import ApiError from '@/utils/apiError';
import { mapId } from '@/utils/mapId';

export async function getSpaInfo() {
    let spa = await Spa.findOne();
    
    if (!spa) {
        spa = await Spa.create({
            information: 'Thông tin về spa sẽ được cập nhật sau.'
        });
    }
    
    return mapId(spa);
}

export async function updateSpaInfo(information: string) {
    if (!information || information.trim() === '') {
        throw new ApiError('Information is required.', 400);
    }

    let spa = await Spa.findOne();
    
    if (!spa) {
        spa = await Spa.create({
            information: information.trim()
        });
    } else {
        spa.information = information.trim();
        await spa.save();
    }
    
    return mapId(spa);
}