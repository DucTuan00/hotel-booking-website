import Room from '@/models/Room';
import RoomImage from '@/models/RoomImage';
import ApiError from '@/utils/apiError';
import { mapId, mapIds } from '@/utils/mapId';
import cron from 'node-cron';
import mongoose from 'mongoose';
import {
    RoomData,
    GetAllRoomsInput,
    RoomIdInput
} from '@/types/room';

const validateRoomData = (data: RoomData) => {
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === "") {
        throw new ApiError("Invalid room name.", 400);
    }

    if (!data.roomType || !['Single', 'Double', 'Suite'].includes(data.roomType)) {
        throw new ApiError("Invalid room type.", 400);
    }

    // Change price to number before validate
    if (data.price) {
        const price = Number(data.price);
        if (isNaN(price) || price <= 0) {
            throw new ApiError("Invalid room price.", 400);
        }
        data.price = price;
    }
    else {
        throw new ApiError("Invalid room price.", 400);
    }

    // Change max guests to number before validate
    if (data.maxGuests) {
        const maxGuests = Number(data.maxGuests);
        if (isNaN(maxGuests) || maxGuests <= 0) {
            throw new ApiError("Invalid max guests.", 400);
        }
        data.maxGuests = maxGuests;
    }
    else {
        throw new ApiError("Invalid max guests.", 400);
    }

    // Validate quantity
    if (data.quantity) {
        const quantity = Number(data.quantity);
        if (isNaN(quantity) || quantity <= 0) {
            throw new ApiError("Invalid room quantity.", 400);
        }
        data.quantity = quantity;
    } else {
        throw new ApiError("Invalid room quantity.", 400);
    }

    // Validate images
    if (data.images && !Array.isArray(data.images)) {
        throw new ApiError("Invalid images. Images should be an array.", 400);
    }

    // if it's a string, parse it to an array of strings
    if (typeof data.amenities === 'string') {
        try {
            data.amenities = JSON.parse(data.amenities);
        } catch (e) {
            throw new ApiError('Invalid amenities format. It must be a JSON string.', 400);
        }
    }
};

const createRoom = async (roomData: RoomData) => {
    validateRoomData(roomData);

    const newRoom = new Room({
        name: roomData.name,
        roomType: roomData.roomType,
        description: roomData.description,
        amenities: roomData.amenities.map(id => new mongoose.Types.ObjectId(id)),
        price: roomData.price,
        maxGuests: roomData.maxGuests,
        quantity: roomData.quantity
    });                             
    console.log(newRoom);

    const room = await newRoom.save();
    
    // Create room images if provided
    if (roomData.images && roomData.images.length > 0) {
        const roomImageData = roomData.images.map(imagePath => ({
            roomId: room._id,
            imagePath: imagePath
        }));
        
        await RoomImage.insertMany(roomImageData);
    }
    
    return mapId(room);
};

const getAllRooms = async (args: GetAllRoomsInput) => {
    const { filter = {}, page = 1, pageSize = 10 } = args;

    const skip = (page - 1) * pageSize;
    const rooms = await Room.find({ ...filter, active: true })
        .skip(skip)
        .limit(pageSize)
        .populate({
            path: 'amenities',
            select: 'name',
        });
    if (!rooms) {
        throw new ApiError('Failed to get rooms', 500);
    }

    // Get images for each room
    const roomsWithImages = await Promise.all(
        rooms.map(async (room) => {
            const roomImages = await RoomImage.find({
                roomId: room._id,
                deletedAt: null
            }).select('_id imagePath').sort({ createdAt: 1 });
            
            const roomData = mapId(room);
            return {
                ...roomData,
                images: roomImages.map(img => ({
                    id: (img as any)._id.toString(),
                    path: img.imagePath
                }))
            };
        })
    );

    const totalRooms = await Room.countDocuments({ ...filter, active: true });
    if (!totalRooms) {
        throw new ApiError('Failed to get total rooms', 500);
    }

    return {
        rooms: roomsWithImages,
        total: totalRooms,
        currentPage: page,
        pageSize: pageSize
    };
};

const getRoomById = async (arg: RoomIdInput) => {
    const { id } = arg;

    if (!id) {
        throw new ApiError("Invalid room id.", 400);
    }

    const room = await Room.findOne({ _id: id, active: true })
        .populate({
            path: 'amenities',
            select: 'name description',
        });
        
    if (!room) {
        throw new ApiError("Room not found.", 404);
    }
    
    // Get room images
    const roomImages = await RoomImage.find({
        roomId: room._id,
        deletedAt: null
    }).select('_id imagePath').sort({ createdAt: 1 });
    
    const roomData = mapId(room);
    return {
        ...roomData,
        images: roomImages.map(img => ({
            id: (img as any)._id.toString(),
            path: img.imagePath
        }))
    };
};


const updateRoom = async (roomData: RoomData) => {
    if (!roomData.id) {
        throw new ApiError("Invalid room id.", 400);
    }

    validateRoomData(roomData);

    const room = await Room.findById(roomData.id);
    if (!room) {
        throw new ApiError('Room not found to update.', 404);
    }

    // Get existing images count
    const existingImagesCount = await RoomImage.countDocuments({
        roomId: roomData.id,
        deletedAt: null
    });

    // Validate total images limit
    if (roomData.images && roomData.images.length > 0) {
        if (roomData.images.length + existingImagesCount > 5) {
            throw new ApiError('Over 5 images allowed', 400);
        }
    }

    // Update room data
    const updatedRoom = await Room.findOneAndUpdate(
        { _id: roomData.id, active: true },
        {
            name: roomData.name,
            roomType: roomData.roomType,
            description: roomData.description,
            amenities: roomData.amenities.map(id => new mongoose.Types.ObjectId(id)),
            price: roomData.price,
            maxGuests: roomData.maxGuests,
            quantity: roomData.quantity
        },
        { new: true }
    );

    if (!updatedRoom) {
        throw new ApiError('Room not found or failed to update.', 404);
    }

    // Add new images if provided
    if (roomData.images && roomData.images.length > 0) {
        const roomImageData = roomData.images.map(imagePath => ({
            roomId: updatedRoom._id,
            imagePath: imagePath
        }));
        
        await RoomImage.insertMany(roomImageData);
    }

    return mapId(updatedRoom);
};

const deleteRoom = async (arg: RoomIdInput) => {
    const { id } = arg;

    if (!id) {
        throw new ApiError("Invalid room id.", 400);
    }

    const room = await Room.findOneAndUpdate(
        { _id: id, active: true },
        { active: false }, // Change active to false
        { new: true }
    );
    if (!room) {
        throw new ApiError('Room not found to delete.', 404);
    }
    
    // Soft delete all room images
    await RoomImage.updateMany(
        { roomId: id, deletedAt: null },
        { deletedAt: new Date() }
    );
    
    return {
        message: 'Deleted room successfully'
    };
};

// const updateRoomAvailability = async () => {
//     try {
//         const rooms = await Room.find({ active: true });
//         const currentDate = new Date();
//         for (const room of rooms) {
//             const { start_date, end_date } = room.availability;

//             const startDate = new Date(start_date);
//             const endDate = new Date(end_date);

//             if (currentDate > endDate) {
//                 room.availability.is_available = false;
//                 continue;
//             }
//             if (currentDate > startDate) {
//                 const daysPassed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));

//                 const newStartDate = new Date(startDate)
//                 newStartDate.setDate(startDate.getDate() + daysPassed);
//                 room.availability.start_date = newStartDate;

//                 const newEndDate = new Date(endDate)
//                 newEndDate.setDate(endDate.getDate() + daysPassed);
//                 room.availability.end_date = newEndDate;
//             } 
//             await room.save();
//         }
//     } catch (error) {
//         console.error('Error updating room availability:', error);
//     }
// };

const deleteRoomImage = async (imageId: string) => {
    if (!imageId) {
        throw new ApiError("Invalid image id.", 400);
    }

    const result = await RoomImage.findByIdAndUpdate(
        imageId,
        { deletedAt: new Date() },
        { new: true }
    );
    
    if (!result) {
        throw new ApiError('Room image not found', 404);
    }
    
    return {
        message: 'Deleted room image successfully'
    };
};

// Schedule daily update for room availability
// cron.schedule('0 0 * * *', () => {
//     updateRoomAvailability();
// });

// Run immediately when server start
//updateRoomAvailability();

export default {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    deleteRoomImage,
    //updateRoomAvailability,
};