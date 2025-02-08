import Amenity from '../models/amenityModel.js';
import ApiError from '../utils/apiError.js';

const createAmenity = async (name) => {
    if (!name || typeof name !== 'string' || name.trim() === "") {
        throw new ApiError("Invalid amenity name.", 400);
    }
    const newAmenity = new Amenity({ name });
    const amenity = await newAmenity.save();
    return amenity;
};

const getAllAmenities = async () => {
    const amenities = await Amenity.find();
    if (!amenities) {
        throw new ApiError('Amenities not found', 404);
    }
    return amenities;
};

const getAmenityById = async (id) => {
    const amenity = await Amenity.findById(id);
    if (!amenity) {
        throw new ApiError("Amenity not found.", 404);
    }
    return amenity;
};

const updateAmenity = async (id, name) => {
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

const deleteAmenity = async (id) => {
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