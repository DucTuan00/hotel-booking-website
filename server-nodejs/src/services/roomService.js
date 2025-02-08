import Room from '../models/roomModel.js';
import ApiError from '../utils/apiError.js';
import cron from 'node-cron';
import mongoose from 'mongoose';

const validateRoomData = (data) => {
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === "") {
        throw new ApiError("Invalid room name.", 400);
    }

    if (!data.room_type || !['Single', 'Double', 'Suite'].includes(data.room_type)) {
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
    if (data.max_guests) {
        const maxGuests = Number(data.max_guests);
        if (isNaN(maxGuests) || maxGuests <= 0) {
            throw new ApiError("Invalid max guests.", 400);
        }
        data.max_guests = maxGuests;
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

    // validate availability
    // if (data.availability) { 
    //     try {
    //         // Try to parse availability as JSON if it's a string
    //         if (typeof data.availability === 'string') {
    //             data.availability = JSON.parse(data.availability);
    //         }

    //         // Check for start_date and end_date after parsing
    //         if (!data.availability.start_date || isNaN(new Date(data.availability.start_date))) {
    //             throw new ApiError('Invalid start date in availability.', 400);
    //         }
    //         if (!data.availability.end_date || isNaN(new Date(data.availability.end_date))) {
    //             throw new ApiError('Invalid end date in availability.', 400);
    //         }
    //     } catch (e) {
    //         throw new ApiError('Invalid availability format. It must be a JSON string.', 400);
    //     }
    // }
};

const createRoom = async (roomData) => {
    validateRoomData(roomData);

    const newRoom = new Room({
        name: roomData.name,
        room_type: roomData.room_type,
        description: roomData.description,
        amenities: roomData.amenities.map(id => new mongoose.Types.ObjectId(id)),
        price: roomData.price,
        images: roomData.images,
        max_guests: roomData.max_guests,
        quantity: roomData.quantity
        // availability: {
        //     start_date: new Date(roomData.availability.start_date),
        //     end_date: new Date(roomData.availability.end_date),
        // },
    });                             
    console.log(newRoom);

    const room = await newRoom.save();
    return room;
};

const getAllRooms = async (filter, page, pageSize) => {
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

    const totalRooms = await Room.countDocuments({ ...filter, active: true });
    if (!totalRooms) {
        throw new ApiError('Failed to get total rooms', 500);
    }

    return {
        rooms: rooms,
        total: totalRooms,
        currentPage: page,
        pageSize: pageSize
    };
};

const getRoomById = async (id) => {
    if (!id) {
        throw new ApiError("Invalid room id.", 400);
    }

    const room = await Room.findOne({ _id: id, active: true })
        .populate({
            path: 'amenities',
            select: 'name description',
        });// find room with existing amenity
        
    if (!room) {
        throw new ApiError("Room not found.", 404);
    }
    
    return room;
};


const updateRoom = async (roomData) => {
    if (!roomData.id) {
        throw new ApiError("Invalid room id.", 400);
    }

    validateRoomData(roomData);

    const room = await Room.findById(roomData.id);
    if (!room) {
        throw new ApiError('Room not found to update.', 404);
    }

    let images = room.images || [];

    if (roomData.images && roomData.images.length > 0) {
        if (roomData.images.length + room.images.length > 5) {
            throw new ApiError('Over 5 images allowed', 400);
        } else {
            for (let i = 0; i < roomData.images.length; i++) {
                images.push(roomData.images[i]);
            }
        }
    } 

    const updatedRoom = await Room.findOneAndUpdate(
        { _id: roomData.id, active: true },
        {
            name: roomData.name,
            room_type: roomData.room_type,
            description: roomData.description,
            amenities: roomData.amenities.map(id => new mongoose.Types.ObjectId(id)),
            price: roomData.price,
            images: images,
            max_guests: roomData.max_guests,
            quantity: roomData.quantity
            // availability: {
            //     start_date: new Date(roomData.availability.start_date),
            //     end_date: new Date(roomData.availability.end_date),
            // },
        },
        { new: true }
    );

    return updatedRoom;
};

const deleteRoom = async (id) => {
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
    return {
        message: 'Deteled room successfully'
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
    //updateRoomAvailability,
};