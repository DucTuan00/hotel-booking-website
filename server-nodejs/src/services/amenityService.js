import Amenity from '../models/amenityModel.js';
import ApiError from '../utils/apiError.js';

const createAmenity = async (name) => {
    try {
        if (!name || typeof name !== 'string' || name.trim() === "") {
            throw new ApiError("Invalid amenity name.", 400);
        }
        const newAmenity = new Amenity({ name });
        const amenity = await newAmenity.save();
        return amenity;
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError("Amenity name exists.", 400);
        }
        throw new ApiError(error.message || 'Can not create amenity.', 500);
    }
};

const getAllAmenities = async () => {
    try {
        const amenities = await Amenity.find();
        return amenities;
    } catch (error) {
        throw new ApiError(error.message || 'Can not get amenity list.', 500);
    }
};

const getAmenityById = async (id) => {
    try {
        const amenity = await Amenity.findById(id);
        if (!amenity) {
            throw new ApiError("Amenity not found.", 404);
        }
        return amenity;
    } catch (error) {
        throw new ApiError(error.message || 'Can not get Amenity by id.', 500);
    }
};

const updateAmenity = async (id, name) => {
    try {
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
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError("Amenity name exists.", 400);
        }
        throw new ApiError(error.message || 'Can not update amenity.', 500);
    }
};

const deleteAmenity = async (id) => {
    try {
        const amenity = await Amenity.findByIdAndDelete(id);
        if (!amenity) {
            throw new ApiError("Amenity not found to delete.", 404);
        }
        return { message: 'Amenity deleted successfully.' };
    } catch (error) {
        throw new ApiError(error.message || 'Can not delete amenity.', 500);
    }
};

export default {
    createAmenity,
    getAllAmenities,
    getAmenityById,
    updateAmenity,
    deleteAmenity,
};