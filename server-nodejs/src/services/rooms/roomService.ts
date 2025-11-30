import Room from '@/models/Room';
import RoomImage from '@/models/RoomImage';
import RoomAmenity from '@/models/RoomAmenity';
import Review from '@/models/Review';
import ApiError from '@/utils/apiError';
import { mapId, mapIds } from '@/utils/mapId';
import mongoose from 'mongoose';
import {
    RoomData,
    RoomResponse,
    GetAllRoomsInput,
    GetAllRoomsResponse,
    RoomIdInput,
    RoomType
} from '@/types/room';

export async function updateRoomAmenities(roomId: string, newAmenityIds: string[]) {
    const currentRoomAmenities = await RoomAmenity.find({ roomId }).select('amenityId');
    const currentAmenityIds = currentRoomAmenities.map(ra => ra.amenityId.toString());
    
    const newAmenityIdStrings = newAmenityIds.map(id => id.toString());
    
    const amenitiesToAdd = newAmenityIdStrings.filter(id => !currentAmenityIds.includes(id));
    
    const amenitiesToRemove = currentAmenityIds.filter(id => !newAmenityIdStrings.includes(id));
    
    if (amenitiesToAdd.length > 0) {
        const roomAmenityData = amenitiesToAdd.map(amenityId => ({
            roomId: new mongoose.Types.ObjectId(roomId),
            amenityId: new mongoose.Types.ObjectId(amenityId)
        }));
        await RoomAmenity.insertMany(roomAmenityData);
    }
    
    if (amenitiesToRemove.length > 0) {
        await RoomAmenity.deleteMany({
            roomId,
            amenityId: { $in: amenitiesToRemove.map(id => new mongoose.Types.ObjectId(id)) }
        });
    }
};

export function validateRoomData(data: RoomData) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === "") {
        throw new ApiError("Invalid room name.", 400);
    }

    if (!data.roomType || !Object.values(RoomType).includes(data.roomType)) {
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

    // Validate roomArea
    if (data.roomArea !== undefined && data.roomArea !== null) {
        const roomArea = Number(data.roomArea);
        if (isNaN(roomArea) || roomArea <= 0) {
            throw new ApiError("Invalid room area. Must be greater than 0.", 400);
        }
        data.roomArea = roomArea;
    }

    // Validate images
    if (data.images && !Array.isArray(data.images)) {
        throw new ApiError("Invalid images. Images should be an array.", 400);
    }

    // Validate amenities
    if (data.amenities) {
        if (typeof data.amenities === 'string') {
            try {
                data.amenities = JSON.parse(data.amenities);
            } catch (e) {
                throw new ApiError('Invalid amenities format. It must be a JSON string.', 400);
            }
        }
        
        if (!Array.isArray(data.amenities)) {
            throw new ApiError("Invalid amenities. Amenities should be an array.", 400);
        }
        
        // Validate each amenity ID
        for (const amenityId of data.amenities) {
            if (typeof amenityId !== 'string' || !mongoose.Types.ObjectId.isValid(amenityId)) {
                throw new ApiError('Invalid amenity ID format.', 400);
            }
        }
    }
};

export async function createRoom(roomData: RoomData) {
    validateRoomData(roomData);

    const newRoom = new Room({
        name: roomData.name,
        roomType: roomData.roomType,
        description: roomData.description,
        price: roomData.price,
        maxGuests: roomData.maxGuests,
        quantity: roomData.quantity,
        roomArea: roomData.roomArea,
        active: false
    });                             
    console.log(newRoom);

    const room = await newRoom.save();
    
    // Create room-amenity relationships if provided
    if (roomData.amenities && roomData.amenities.length > 0) {
        await updateRoomAmenities((room as any)._id.toString(), roomData.amenities.map(id => id.toString()));
    }
    
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

export async function getAllRooms(args: GetAllRoomsInput): Promise<GetAllRoomsResponse> {
    const { search, roomType, sortBy, sortOrder, page = 1, pageSize = 10 } = args;

    const buildQuery = () => {
        let query: any = { deletedAt: null }; 

        if (search) {
            query.name = new RegExp(search, 'i'); // 'i' for case-insensitive
        }

        if (roomType) {
            query.roomType = roomType;
        }

        return query;
    };

    // Build sort object
    const buildSort = (): Record<string, 1 | -1> => {
        if (!sortBy || !sortOrder) {
            return { createdAt: -1 }; // Default: newest first
        }

        const order = sortOrder === 'asc' ? 1 : -1;
        return { [sortBy]: order };
    };

    const queryConditions = buildQuery();
    const sortConditions = buildSort();
    const skip = (page - 1) * pageSize;

    const [rooms, totalRooms] = await Promise.all([
        Room.find(queryConditions).sort(sortConditions).skip(skip).limit(pageSize),
        Room.countDocuments(queryConditions)
    ]);
        
    if (!rooms) {
        throw new ApiError('Failed to get rooms', 500);
    }

    // Get images, amenities, and ratings for each room
    const roomsWithImagesAndAmenities = await Promise.all(
        rooms.map(async (room) => {
            // Get room images
            const roomImages = await RoomImage.find({
                roomId: (room as any)._id,
                deletedAt: null
            }).select('_id imagePath').sort({ createdAt: 1 });
            
            // Get room amenities through junction table
            const roomAmenities = await RoomAmenity.find({
                roomId: (room as any)._id
            }).populate({
                path: 'amenityId',
                select: 'name'
            });

            // Get room rating
            const ratingStats = await Review.aggregate([
                { $match: { roomId: (room as any)._id, deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' },
                        totalReviews: { $sum: 1 }
                    }
                }
            ]);
            
            const roomData = mapId(room);
            return {
                ...roomData,
                images: roomImages.map(img => ({
                    id: (img as any)._id.toString(),
                    path: img.imagePath
                })),
                amenities: roomAmenities.map(ra => ({
                    id: (ra as any).amenityId._id.toString(),
                    name: (ra as any).amenityId.name
                })),
                averageRating: ratingStats.length > 0 ? Math.round(ratingStats[0].averageRating * 10) / 10 : 0,
                totalReviews: ratingStats.length > 0 ? ratingStats[0].totalReviews : 0
            };
        })
    );

    return {
        rooms: roomsWithImagesAndAmenities,
        total: totalRooms,
        currentPage: page,
        pageSize: pageSize
    };
};

export async function getAllRoomsWithoutPagination() {
    const rooms = await Room.find({ deletedAt: null });
        
    if (!rooms) {
        throw new ApiError('Failed to get rooms', 500);
    }

    const roomsMapId = mapIds(rooms);

    return roomsMapId;
};

export async function getActiveRooms(args: GetAllRoomsInput): Promise<GetAllRoomsResponse> {
    const { search, roomType, sortBy, sortOrder, page = 1, pageSize = 10 } = args;

    const buildQuery = () => {
        let query: any = { 
            deletedAt: null, 
            active: true 
        };

        if (search) {
            query.name = new RegExp(search, 'i');
        }

        if (roomType) {
            query.roomType = roomType;
        }

        return query;
    };

    // Build sort object
    const buildSort = (): Record<string, 1 | -1> => {
        if (!sortBy || !sortOrder) {
            return { createdAt: -1 }; // Default: newest first
        }

        const order = sortOrder === 'asc' ? 1 : -1;
        return { [sortBy]: order };
    };

    const queryConditions = buildQuery();
    const sortConditions = buildSort();
    const skip = (page - 1) * pageSize;

    const [rooms, totalRooms] = await Promise.all([
        Room.find(queryConditions).sort(sortConditions).skip(skip).limit(pageSize),
        Room.countDocuments(queryConditions)
    ]);
        
    if (!rooms) {
        throw new ApiError('Failed to get active rooms', 500);
    }

    // Get images, amenities, and ratings for each room
    const roomsWithImagesAndAmenities = await Promise.all(
        rooms.map(async (room) => {
            
            const roomImages = await RoomImage.find({
                roomId: (room as any)._id,
                deletedAt: null
            }).select('_id imagePath').sort({ createdAt: 1 });
            
            const roomAmenities = await RoomAmenity.find({
                roomId: (room as any)._id
            }).populate({
                path: 'amenityId',
                select: 'name'
            });

            // Get room rating
            const ratingStats = await Review.aggregate([
                { $match: { roomId: (room as any)._id, deletedAt: null } },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' },
                        totalReviews: { $sum: 1 }
                    }
                }
            ]);
            
            const roomData = mapId(room);
            return {
                ...roomData,
                images: roomImages.map(img => ({
                    id: (img as any)._id.toString(),
                    path: img.imagePath
                })),
                amenities: roomAmenities.map(ra => ({
                    id: (ra as any).amenityId._id.toString(),
                    name: (ra as any).amenityId.name,
                })),
                averageRating: ratingStats.length > 0 ? Math.round(ratingStats[0].averageRating * 10) / 10 : 0,
                totalReviews: ratingStats.length > 0 ? ratingStats[0].totalReviews : 0
            };
        })
    );

    return {
        rooms: roomsWithImagesAndAmenities,
        total: totalRooms,
        currentPage: page,
        pageSize: pageSize
    };
};

export async function getRoomById(arg: RoomIdInput): Promise<RoomResponse> {
    const { id } = arg;

    if (!id) {
        throw new ApiError("Invalid room id.", 400);
    }

    const room = await Room.findOne({ _id: id, deletedAt: null, active: true });
        
    if (!room) {
        throw new ApiError("Room not found.", 404);
    }
    
    // Get room images
    const roomImages = await RoomImage.find({
        roomId: (room as any)._id,
        deletedAt: null
    }).select('_id imagePath').sort({ createdAt: 1 });
    
    // Get room amenities through junction table
    const roomAmenities = await RoomAmenity.find({
        roomId: (room as any)._id
    }).populate({
        path: 'amenityId',
        select: 'name'
    });

    // Get room rating
    const ratingStats = await Review.aggregate([
        { $match: { roomId: (room as any)._id, deletedAt: null } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);
    
    const roomData = mapId(room);
    return {
        ...roomData,
        images: roomImages.map(img => ({
            id: (img as any)._id.toString(),
            path: img.imagePath
        })),
        amenities: roomAmenities.map(ra => ({
            id: (ra as any).amenityId._id.toString(),
            name: (ra as any).amenityId.name,
        })),
        averageRating: ratingStats.length > 0 ? Math.round(ratingStats[0].averageRating * 10) / 10 : 0,
        totalReviews: ratingStats.length > 0 ? ratingStats[0].totalReviews : 0
    };
};


export async function updateRoom(roomData: RoomData) {
    if (!roomData.id) {
        throw new ApiError("Invalid room id.", 400);
    }

    validateRoomData(roomData);

    const room = await Room.findById(roomData.id);
    if (!room) {
        throw new ApiError('Room not found to update.', 404);
    }

    if (roomData.images && roomData.images.length > 5) {
        throw new ApiError('Maximum 5 images allowed', 400);
    }

    // Update room data
    const updatedRoom = await Room.findOneAndUpdate(
        { _id: roomData.id, deletedAt: null },
        {
            name: roomData.name,
            roomType: roomData.roomType,
            description: roomData.description,
            price: roomData.price,
            maxGuests: roomData.maxGuests,
            quantity: roomData.quantity,
            roomArea: roomData.roomArea
        },
        { new: true }
    );

    if (!updatedRoom) {
        throw new ApiError('Room not found or failed to update.', 404);
    }

    // Update room-amenity relationships
    if (roomData.amenities) {
        await updateRoomAmenities(roomData.id, roomData.amenities.map(id => id.toString()));
    }

    if (roomData.images) {
        await RoomImage.deleteMany(
            { roomId: roomData.id, deletedAt: null }
        );

        if (roomData.images.length > 0) {
            const roomImageData = roomData.images.map(imagePath => ({
                roomId: updatedRoom._id,
                imagePath: imagePath
            }));
            
            await RoomImage.insertMany(roomImageData);
        }
    }

    return mapId(updatedRoom);
};

export async function deleteRoom(arg: RoomIdInput) {
    const { id } = arg;

    if (!id) {
        throw new ApiError("Invalid room id.", 400);
    }

    const room = await Room.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true }
    );
    if (!room) {
        throw new ApiError('Room not found to delete.', 404);
    }
    
    // Delete all room-amenity relationships
    await RoomAmenity.deleteMany({ roomId: id });
    
    // Soft delete all room images
    await RoomImage.updateMany(
        { roomId: id, deletedAt: null },
        { deletedAt: new Date() }
    );
    
    return {
        message: 'Deleted room successfully'
    };
};

export async function toggleRoomActive(arg: RoomIdInput) {
    const { id } = arg;

    if (!id) {
        throw new ApiError("Invalid room id.", 400);
    }

    const room = await Room.findOne({ _id: id, deletedAt: null });
    if (!room) {
        throw new ApiError('Room not found.', 404);
    }

    const updatedRoom = await Room.findOneAndUpdate(
        { _id: id, deletedAt: null },
        { active: !room.active },
        { new: true }
    );

    if (!updatedRoom) {
        throw new ApiError('Failed to toggle room active status.', 500);
    }

    return {
        ...mapId(updatedRoom),
        message: `Room ${updatedRoom.active ? 'activated' : 'deactivated'} successfully`
    };
};

export async function deleteRoomImage(imageId: string) {
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