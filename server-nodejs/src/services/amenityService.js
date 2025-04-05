import Amenity from '../models/amenityModel.js';
import Room from '../models/roomModel.js';
import ApiError from '../utils/apiError.js';

const createAmenity = async (name) => {
    if (!name || typeof name !== 'string' || name.trim() === "") {
        throw new ApiError("Invalid amenity name.", 400);
    }
    const newAmenity = new Amenity({ name });
    const amenity = await newAmenity.save();
    return amenity;
};

const getAllAmenities = async (filter, page, pageSize) => {
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