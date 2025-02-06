import roomService from '../services/roomService.js';
import ApiError from '../utils/apiError.js';
import multer from 'multer';
import path from 'path';

// Config Multer to upload images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Image folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Original image's name
    },
});

const upload = multer({ storage: storage });

const createRoom = async (req, res, next) => {
    try {
        upload.array('images', 5)(req, res, async (err) => { // field images, maximum 5
            if (err instanceof multer.MulterError) {
                return next(new ApiError('Error uploading images: ' + err.message, 400));
            } else if (err) {
                return next(new ApiError(err.message || 'Unknown error during image upload', 500));
            } 
            
            const { name, room_type, description, amenities, price, max_guests, quantity } = req.body;
            const images = req.files ? req.files.map(file => file.path) : [];

            console.log('Request Body:', req.body);

            try {
                const room = await roomService.createRoom({
                    name, 
                    room_type, 
                    description, 
                    amenities, 
                    price, 
                    images, 
                    max_guests,
                    quantity, 
                });
    
                res.status(201).json(room);
            } catch(error) {
                next(error);
            }
        });
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getAllRooms = async (req, res, next) => {
    try {
        const { page = 1, pageSize = 10, ...filter } = req.query;
        const result = await roomService.getAllRooms(filter, parseInt(page), parseInt(pageSize));
        res.json(result);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const getRoomById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const room = await roomService.getRoomById(id);
        res.json(room);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const updateRoom = async (req, res, next) => {
    try {
        upload.array('images', 5)(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return next(new ApiError('Error uploading images: ' + err.message, 400));
            } else if (err) {
                return next(new ApiError(err.message || 'Unknown error during image upload', 500));
            }
            const { id } = req.params;
            const { name, room_type, description, amenities, price, max_guests, quantity } = req.body;
            const images = req.files ? req.files.map(file => file.path) : [];

            try {
                const updatedRoom = await roomService.updateRoom({
                    id, 
                    name, 
                    room_type, 
                    description, 
                    amenities, 
                    price, 
                    images, 
                    max_guests,
                    quantity, 
                });
    
                res.json(updatedRoom);
            } catch (error) {
                next(error);
            }
        });
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

const deleteRoom = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await roomService.deleteRoom(id);
        res.json(result);
    } catch (error) {
        next(new ApiError(error.message, error.statusCode || 500));
    }
};

export default {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
};