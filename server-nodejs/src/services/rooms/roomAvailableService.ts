import RoomAvailable from '@/models/RoomAvailable';
import Room from '@/models/Room';
import ApiError from '@/utils/apiError';
import { mapId } from '@/utils/mapId';
import mongoose from 'mongoose';

export interface RoomAvailableData {
    roomId: string;
    date: Date;
    price: number;
    inventory: number;
}

export interface RoomAvailableInput {
    roomId: string;
    startDate: Date;
    endDate: Date;
    price: number;
    inventory: number;
}

export interface GetRoomAvailableInput {
    roomId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
}

export interface UpdateRoomAvailableInput {
    roomId: string;
    date: Date;
    price?: number;
    inventory?: number;
}

const validateRoomAvailableData = (data: RoomAvailableData) => {
    if (!data.roomId || !mongoose.Types.ObjectId.isValid(data.roomId)) {
        throw new ApiError("Invalid room ID.", 400);
    }

    if (!data.date || !(data.date instanceof Date) || isNaN(data.date.getTime())) {
        throw new ApiError("Invalid date.", 400);
    }

    if (typeof data.price !== 'number' || data.price <= 0) {
        throw new ApiError("Price must be a positive number.", 400);
    }

    if (typeof data.inventory !== 'number' || data.inventory < 0 || !Number.isInteger(data.inventory)) {
        throw new ApiError("Inventory must be a non-negative integer.", 400);
    }
};

const createRoomAvailable = async (data: RoomAvailableData) => {
    validateRoomAvailableData(data);

    // Check if room exists
    const room = await Room.findById(data.roomId);
    if (!room) {
        throw new ApiError("Room not found.", 404);
    }

    // Check if room available for this date already exists
    const existingRoomAvailable = await RoomAvailable.findOne({
        roomId: data.roomId,
        date: data.date
    });

    if (existingRoomAvailable) {
        throw new ApiError("Room availability for this date already exists.", 400);
    }

    const newRoomAvailable = new RoomAvailable({
        roomId: data.roomId,
        date: data.date,
        price: data.price,
        inventory: data.inventory
    });

    const roomAvailable = await newRoomAvailable.save();
    return mapId(roomAvailable);
};

const createBulkRoomAvailable = async (input: RoomAvailableInput) => {
    const { roomId, startDate, endDate, price, inventory } = input;

    // Validate input
    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
        throw new ApiError("Invalid room ID.", 400);
    }

    if (!startDate || !endDate) {
        throw new ApiError("Start date and end date are required.", 400);
    }

    if (startDate >= endDate) {
        throw new ApiError("Start date must be before end date.", 400);
    }

    if (typeof price !== 'number' || price <= 0) {
        throw new ApiError("Price must be a positive number.", 400);
    }

    if (typeof inventory !== 'number' || inventory < 0 || !Number.isInteger(inventory)) {
        throw new ApiError("Inventory must be a non-negative integer.", 400);
    }

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
        throw new ApiError("Room not found.", 404);
    }

    const roomAvailableData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        roomAvailableData.push({
            roomId: new mongoose.Types.ObjectId(roomId),
            date: new Date(currentDate),
            price: price,
            inventory: inventory
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    try {
        // Use insertMany with ordered: false to insert what we can
        const result = await RoomAvailable.insertMany(roomAvailableData, { 
            ordered: false,
            rawResult: true 
        });
        
        return {
            success: true,
            insertedCount: result.insertedCount,
            message: `Successfully created ${result.insertedCount} room availability records.`
        };
    } catch (error: any) {
        if (error.code === 11000) {
            // Handle duplicate key error
            const insertedCount = error.result?.insertedCount || 0;
            return {
                success: true,
                insertedCount: insertedCount,
                message: `Successfully created ${insertedCount} room availability records. Some dates already exist.`
            };
        }
        throw error;
    }
};

const getRoomAvailable = async (input: GetRoomAvailableInput) => {
    const { roomId, startDate, endDate, page = 1, pageSize = 100 } = input;

    const filter: any = {};

    if (roomId) {
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            throw new ApiError("Invalid room ID.", 400);
        }
        filter.roomId = roomId;
    }

    if (startDate || endDate) {
        filter.date = {};
        if (startDate) {
            filter.date.$gte = startDate;
        }
        if (endDate) {
            filter.date.$lte = endDate;
        }
    }

    const skip = (page - 1) * pageSize;
    
    const roomAvailables = await RoomAvailable.find(filter)
        .populate({
            path: 'roomId',
            select: 'name roomType'
        })
        .sort({ date: 1 })
        .skip(skip)
        .limit(pageSize);

    const total = await RoomAvailable.countDocuments(filter);

    return {
        roomAvailables: roomAvailables.map(ra => ({
            id: (ra._id as any).toString(),
            roomId: (ra.roomId._id as any).toString(),
            room: {
                id: (ra.roomId._id as any).toString(),
                name: (ra.roomId as any).name,
                roomType: (ra.roomId as any).roomType
            },
            date: ra.date,
            price: ra.price,
            inventory: ra.inventory,
            createdAt: ra.createdAt,
            updatedAt: ra.updatedAt
        })),
        total,
        currentPage: page,
        pageSize: pageSize
    };
};

const updateRoomAvailable = async (input: UpdateRoomAvailableInput) => {
    const { roomId, date, price, inventory } = input;

    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
        throw new ApiError("Invalid room ID.", 400);
    }

    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        throw new ApiError("Invalid date.", 400);
    }

    const updateData: any = {};

    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            throw new ApiError("Price must be a positive number.", 400);
        }
        updateData.price = price;
    }

    if (inventory !== undefined) {
        if (typeof inventory !== 'number' || inventory < 0 || !Number.isInteger(inventory)) {
            throw new ApiError("Inventory must be a non-negative integer.", 400);
        }
        updateData.inventory = inventory;
    }

    if (Object.keys(updateData).length === 0) {
        throw new ApiError("No valid fields to update.", 400);
    }

    const roomAvailable = await RoomAvailable.findOneAndUpdate(
        { roomId, date },
        updateData,
        { new: true, runValidators: true }
    ).populate({
        path: 'roomId',
        select: 'name roomType'
    });

    if (!roomAvailable) {
        throw new ApiError("Room availability not found for the specified date.", 404);
    }

    return {
        id: (roomAvailable._id as any).toString(),
        roomId: (roomAvailable.roomId._id as any).toString(),
        room: {
            id: (roomAvailable.roomId._id as any).toString(),
            name: (roomAvailable.roomId as any).name,
            roomType: (roomAvailable.roomId as any).roomType
        },
        date: roomAvailable.date,
        price: roomAvailable.price,
        inventory: roomAvailable.inventory,
        createdAt: roomAvailable.createdAt,
        updatedAt: roomAvailable.updatedAt
    };
};

const deleteRoomAvailable = async (roomId: string, date: Date) => {
    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
        throw new ApiError("Invalid room ID.", 400);
    }

    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        throw new ApiError("Invalid date.", 400);
    }

    const roomAvailable = await RoomAvailable.findOneAndDelete({
        roomId,
        date
    });

    if (!roomAvailable) {
        throw new ApiError("Room availability not found for the specified date.", 404);
    }

    return {
        message: "Room availability deleted successfully."
    };
};

const getAllRoomsAvailability = async (startDate: Date, endDate: Date) => {
    if (!startDate || !endDate) {
        throw new ApiError("Start date and end date are required.", 400);
    }

    if (startDate >= endDate) {
        throw new ApiError("Start date must be before end date.", 400);
    }

    const rooms = await Room.find({ active: true }).select('_id name roomType price quantity');
    
    const roomAvailables = await RoomAvailable.find({
        date: { $gte: startDate, $lte: endDate }
    }).sort({ roomId: 1, date: 1 });

    // Group availability by roomId
    const availabilityByRoom = roomAvailables.reduce((acc: any, item) => {
        const roomId = item.roomId.toString();
        if (!acc[roomId]) {
            acc[roomId] = [];
        }
        acc[roomId].push({
            date: item.date,
            price: item.price,
            inventory: item.inventory
        });
        return acc;
    }, {});

    console.log(availabilityByRoom);

    return rooms.map(room => ({
        id: (room._id as any).toString(),
        name: room.name,
        roomType: room.roomType,
        defaultPrice: room.price,
        defaultInventory: room.quantity,
        availability: availabilityByRoom[(room._id as any).toString()] || []
    }));
};

export default {
    createRoomAvailable,
    createBulkRoomAvailable,
    getRoomAvailable,
    updateRoomAvailable,
    deleteRoomAvailable,
    getAllRoomsAvailability
};
