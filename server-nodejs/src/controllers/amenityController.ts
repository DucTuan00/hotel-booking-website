import amenityService from '@/services/amenityService';
import ApiError from '@/utils/apiError';
import { Request, Response, NextFunction } from 'express';

const createAmenity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const amenity = await amenityService.createAmenity(name);
        res.status(201).json(amenity);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getAllAmenities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, pageSize = 10, ...filter } = req.query;
        const amenities = await amenityService.getAllAmenities({
            ...filter,
            page: parseInt(page as string),
            pageSize: parseInt(pageSize as string)
        });
        res.json(amenities);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getAmenityById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const amenity = await amenityService.getAmenityById({ id });
        res.json(amenity);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const updateAmenity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedAmenity = await amenityService.updateAmenity({ id, name });
        res.json(updatedAmenity);
    } catch (error: any) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const deleteAmenity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await amenityService.deleteAmenity({ id });
        res.json(result);
    } catch (error: any) {
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
