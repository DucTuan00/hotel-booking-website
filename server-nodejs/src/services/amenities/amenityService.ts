import Amenity from '@/models/Amenity';
import RoomAmenity from '@/models/RoomAmenity';
import ApiError from '@/utils/apiError';
import { mapId, mapIds } from '@/utils/mapId';
import {
    CreateAmenityInput,
    GetAllAmenitiesInput,
    GetAmenityByIdInput,
    UpdateAmenityInput
} from '@/types/amenity';

export async function createAmenity(arg: CreateAmenityInput) {
    const { name } = arg;

    if (!name || typeof name !== 'string' || name.trim() === "") {
        throw new ApiError("Invalid amenity name.", 400);
    }

    const newAmenity = new Amenity({ name });
    const amenity = await newAmenity.save();
    return mapId(amenity);
};

export async function getAllAmenities(args: GetAllAmenitiesInput) {
    const { search, sortBy, sortOrder, page = 1, pageSize = 10 } = args;

    const buildQuery = () => {
        let query: any = {};

        if (search) {
            query.name = new RegExp(search, 'i'); // 'i' for case-insensitive
        }

        return query;
    };

    // Build sort object
    const buildSort = (): Record<string, 1 | -1> => {
        if (!sortBy || !sortOrder) {
            return { createdAt: -1 }; // Default: newest first
        }

        const order = sortOrder === 'asc' ? 1 : -1;
        return { [sortBy]: order };
    };

    const queryConditions = buildQuery();
    const sortConditions = buildSort();
    const skip = (page - 1) * pageSize;

    const [amenities, totalAmenities] = await Promise.all([
        Amenity.find(queryConditions).sort(sortConditions).skip(skip).limit(pageSize),
        Amenity.countDocuments(queryConditions)
    ]);

    if (!amenities) {
        throw new ApiError('Amenities not found', 404);
    }

    return {
        amenities: mapIds(amenities),
        total: totalAmenities,
        currentPage: page,
        pageSize: pageSize
    };
};

export async function getAmenityById(arg: GetAmenityByIdInput) {
    const { id } = arg;
    const amenity = await Amenity.findById(id);

    if (!amenity) {
        throw new ApiError("Amenity not found.", 404);
    }

    return mapId(amenity);
};

export async function updateAmenity(args: UpdateAmenityInput) {
    const { id, name } = args;

    if (!name || typeof name !== 'string' || name.trim() === "") {
        throw new ApiError("Invalid amenity name.", 400);
    }

    const amenity = await Amenity.findByIdAndUpdate(
        id,
        { name },
        { new: true }
    );

    if (!amenity) {
        throw new ApiError("Amenity not found to update.", 404);
    }

    return mapId(amenity);
};

export async function deleteAmenity(arg: GetAmenityByIdInput) {
    const { id } = arg;

    await RoomAmenity.deleteMany({ amenityId: id });

    const amenity = await Amenity.findByIdAndDelete(id);

    if (!amenity) {
        throw new ApiError("Amenity not found to delete.", 404);
    }
    
    return { message: 'Amenity deleted successfully.' };
};
