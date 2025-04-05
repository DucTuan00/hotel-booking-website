import amenityService from '../services/amenityService.js';
import ApiError from '../utils/apiError.js';

const createAmenity = async (req, res, next) => {
    try {
        const { name } = req.body;
        const amenity = await amenityService.createAmenity(name);
        res.status(201).json(amenity);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getAllAmenities = async (req, res, next) => {
    try {
        const { page = 1, pageSize = 10, ...filter } = req.query;
        const amenities = await amenityService.getAllAmenities(filter, parseInt(page), parseInt(pageSize));
        res.json(amenities);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getAmenityById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const amenity = await amenityService.getAmenityById(id);
        res.json(amenity);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const updateAmenity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedAmenity = await amenityService.updateAmenity(id, name);
        res.json(updatedAmenity);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const deleteAmenity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await amenityService.deleteAmenity(id);
        res.json(result);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};


export default {
    createAmenity,
    getAllAmenities,
    getAmenityById,
    updateAmenity,
    deleteAmenity,
};