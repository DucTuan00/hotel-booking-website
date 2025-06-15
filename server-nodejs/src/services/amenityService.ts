import Amenity from '@/models/Amenity';
import Room from '@/models/Room';
import ApiError from '@/utils/apiError';

interface CreateAmenityInput {
    name: string;
}

interface UpdateAmenityInput {
    id: string;
    name: string;
}

interface GetAllAmenitiesInput {
    filter?: Record<string, any>;
    page?: number;
    pageSize?: number;
}

interface GetAmenityByIdInput {
    id: string;
}

const createAmenity = async (arg: CreateAmenityInput) => {
    const { name } = arg;

    if (!name || typeof name !== 'string' || name.trim() === "") {
        throw new ApiError("Invalid amenity name.", 400);
    }

    const newAmenity = new Amenity({ name });
    const amenity = await newAmenity.save();
    return amenity;
};

const getAllAmenities = async (args: GetAllAmenitiesInput) => {
    const { filter = {}, page = 1, pageSize = 10 } = args;

    const skip = (page - 1) * pageSize;

    const amenities = await Amenity.find({ ...filter })
        .skip(skip)
        .limit(pageSize);

    if (!amenities) {
        throw new ApiError('Amenities not found', 404);
    }

    const totalAmenities = await Amenity.countDocuments({ ...filter });

    if (!totalAmenities) {
        throw new ApiError('Failed to get total amenities', 500);
    }

    return {
        amenities: amenities,
        total: totalAmenities,
        currentPage: page,
        pageSize: pageSize
    };
};

const getAmenityById = async (arg: GetAmenityByIdInput) => {
    const { id } = arg;
    const amenity = await Amenity.findById(id);

    if (!amenity) {
        throw new ApiError("Amenity not found.", 404);
    }

    return amenity;
};

const updateAmenity = async (args: UpdateAmenityInput) => {
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

    return amenity;
};

const deleteAmenity = async (arg: GetAmenityByIdInput) => {
    const { id } = arg;

    await Room.updateMany(
        { amenities: id }, // Find all rooms contains this amenity id
        { $pull: { amenities: id } } // Remove the amenity id
    );

    const amenity = await Amenity.findByIdAndDelete(id);

    if (!amenity) {
        throw new ApiError("Amenity not found to delete.", 404);
    }
    
    return { message: 'Amenity deleted successfully.' };
};

export default {
    createAmenity,
    getAllAmenities,
    getAmenityById,
    updateAmenity,
    deleteAmenity,
};
