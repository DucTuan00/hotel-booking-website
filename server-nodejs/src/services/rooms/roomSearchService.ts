import Room from '@/models/Room';
import RoomAvailable from '@/models/RoomAvailable';
import RoomAmenity from '@/models/RoomAmenity';
import RoomImage from '@/models/RoomImage';
import Amenity from '@/models/Amenity';
import ApiError from '@/utils/apiError';
import mongoose from 'mongoose';
import { RoomType } from '@/types/room';

interface SearchAvailableRoomsInput {
    checkIn?: Date;
    checkOut?: Date;
    guests?: number; // Deprecated: for backward compatibility
    adults?: number;
    children?: number;
    roomType?: RoomType;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    page: number;
    pageSize: number;
}

export async function searchAvailableRooms(input: SearchAvailableRoomsInput) {
    const {
        checkIn,
        checkOut,
        guests,
        adults,
        children,
        roomType,
        minPrice,
        maxPrice,
        amenities,
        page = 1,
        pageSize = 10
    } = input;

    // Build base filter for active rooms
    const roomFilter: any = { active: true };

    // Filter by room type
    if (roomType) {
        roomFilter.roomType = roomType;
    }

    // Filter by max guests with flexible logic
    // If children <= 2, they are "flexible" and don't count strictly towards maxGuests
    // Only adults (and children > 2) are counted
    if (adults !== undefined && adults > 0) {
        const childrenCount = children || 0;
        let minGuestsRequired: number;
        
        if (childrenCount <= 2) {
            // Children <= 2 are flexible, only count adults
            minGuestsRequired = adults;
        } else {
            // Children > 2: count adults + (children - 2)
            // This means first 2 children are "free", additional children count
            minGuestsRequired = adults + (childrenCount - 2);
        }
        
        roomFilter.maxGuests = { $gte: minGuestsRequired };
    } else if (guests && guests > 0) {
        // Backward compatibility: if using old 'guests' param
        roomFilter.maxGuests = { $gte: guests };
    }

    // Filter by amenities
    if (amenities && amenities.length > 0) {
        // Get amenity IDs from names
        const amenityDocs = await Amenity.find({ name: { $in: amenities } });
        const amenityIds = amenityDocs.map(a => a._id);
        
        if (amenityIds.length > 0) {
            // Find rooms that have ALL selected amenities
            const roomsWithAllAmenities = await RoomAmenity.aggregate([
                {
                    $match: {
                        amenityId: { $in: amenityIds }
                    }
                },
                {
                    $group: {
                        _id: '$roomId',
                        count: { $sum: 1 }
                    }
                },
                {
                    $match: {
                        count: amenityIds.length // Must have all selected amenities
                    }
                }
            ]);
            
            const roomIdsWithAmenities = roomsWithAllAmenities.map(r => r._id);
            roomFilter._id = { $in: roomIdsWithAmenities };
        } else {
            // No matching amenities found, return empty result
            roomFilter._id = { $in: [] };
        }
    }

    // Get base rooms matching the criteria
    let baseRooms = await Room.find(roomFilter).lean(); // Don't populate yet

    // If date range is provided, filter by availability
    if (checkIn && checkOut) {
        const availableRoomIds = await getAvailableRoomIds(checkIn, checkOut);
        
        // Filter rooms to only include those with availability
        baseRooms = baseRooms.filter((room: any) => 
            availableRoomIds.includes(room._id.toString())
        );

        // Get pricing information for available dates
        const roomsWithPricing = await Promise.all(
            baseRooms.map(async (room: any) => {
                const avgPrice = await getAveragePriceForDateRange(
                    room._id.toString(), 
                    checkIn, 
                    checkOut
                );
                return {
                    ...room,
                    searchPrice: avgPrice || room.price // Use average price or default
                };
            })
        );

        // Filter by price range using searchPrice
        let filteredRooms = roomsWithPricing;
        if (minPrice !== undefined || maxPrice !== undefined) {
            filteredRooms = roomsWithPricing.filter((room: any) => {
                if (minPrice !== undefined && room.searchPrice < minPrice) return false;
                if (maxPrice !== undefined && room.searchPrice > maxPrice) return false;
                return true;
            });
        }

        // Pagination
        const total = filteredRooms.length;
        const skip = (page - 1) * pageSize;
        const paginatedRooms = filteredRooms.slice(skip, skip + pageSize);

        const roomIds = paginatedRooms.map((room: any) => room._id);
        
        const roomAmenities = await RoomAmenity.find({ roomId: { $in: roomIds } })
            .populate('amenityId', 'name')
            .lean();
        
        const roomImages = await RoomImage.find({ roomId: { $in: roomIds } })
            .lean();
        
        const roomsWithRelations = paginatedRooms.map((room: any) => {
            const roomIdStr = room._id.toString();
            
            const amenitiesForRoom = roomAmenities
                .filter((ra: any) => ra.roomId.toString() === roomIdStr)
                .map((ra: any) => ra.amenityId);
            
            const imagesForRoom = roomImages
                .filter((ri: any) => ri.roomId.toString() === roomIdStr);
            
            return {
                ...room,
                amenities: amenitiesForRoom,
                images: imagesForRoom
            };
        });

        return {
            rooms: roomsWithRelations.map((room: any) => ({
                id: room._id.toString(),
                name: room.name,
                roomType: room.roomType,
                description: room.description,
                price: room.searchPrice, // Use search price instead of default
                images: room.images.map((img: any) => ({
                    id: img._id.toString(),
                    path: img.path
                })),
                amenities: room.amenities.map((amenity: any) => ({
                    id: amenity._id.toString(),
                    name: amenity.name
                })),
                maxGuests: room.maxGuests,
                quantity: room.quantity,
                roomArea: room.roomArea,
                active: room.active
            })),
            total,
            currentPage: page,
            pageSize
        };
    }

    // No date range - use default price filtering
    let filteredRooms = baseRooms;
    if (minPrice !== undefined || maxPrice !== undefined) {
        filteredRooms = baseRooms.filter((room: any) => {
            if (minPrice !== undefined && room.price < minPrice) return false;
            if (maxPrice !== undefined && room.price > maxPrice) return false;
            return true;
        });
    }

    // Pagination
    const total = filteredRooms.length;
    const skip = (page - 1) * pageSize;
    const paginatedRooms = filteredRooms.slice(skip, skip + pageSize);

    const roomIds = paginatedRooms.map((room: any) => room._id);
    
    const roomAmenities = await RoomAmenity.find({ roomId: { $in: roomIds } })
        .populate('amenityId', 'name')
        .lean();
    
    const roomImages = await RoomImage.find({ roomId: { $in: roomIds } })
        .lean();
    
    const roomsWithRelations = paginatedRooms.map((room: any) => {
        const roomIdStr = room._id.toString();
        
        const amenitiesForRoom = roomAmenities
            .filter((ra: any) => ra.roomId.toString() === roomIdStr)
            .map((ra: any) => ra.amenityId);
        
        const imagesForRoom = roomImages
            .filter((ri: any) => ri.roomId.toString() === roomIdStr);
        
        return {
            ...room,
            amenities: amenitiesForRoom,
            images: imagesForRoom
        };
    });

    return {
        rooms: roomsWithRelations.map((room: any) => ({
            id: room._id.toString(),
            name: room.name,
            roomType: room.roomType,
            description: room.description,
            price: room.price,
            images: room.images.map((img: any) => ({
                id: img._id.toString(),
                path: img.path
            })),
            amenities: room.amenities.map((amenity: any) => ({
                id: amenity._id.toString(),
                name: amenity.name
            })),
            maxGuests: room.maxGuests,
            quantity: room.quantity,
            roomArea: room.roomArea,
            active: room.active
        })),
        total,
        currentPage: page,
        pageSize
    };
}

/**
 * Get room IDs that have availability for all dates in the range
 */
async function getAvailableRoomIds(startDate: Date, endDate: Date): Promise<string[]> {
    // Calculate number of days in the range
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Find all availability records in the date range with inventory > 0
    const availabilities = await RoomAvailable.find({
        date: { $gte: startDate, $lt: endDate },
        inventory: { $gt: 0 }
    }).select('roomId date');

    // Group by roomId and count dates
    const roomDateCounts = availabilities.reduce((acc, record) => {
        const roomId = record.roomId.toString();
        acc[roomId] = (acc[roomId] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Return only rooms that have availability for ALL dates in the range
    return Object.entries(roomDateCounts)
        .filter(([_, count]) => count === days)
        .map(([roomId]) => roomId);
}

/**
 * Calculate average price for a room in a date range
 */
async function getAveragePriceForDateRange(
    roomId: string, 
    startDate: Date, 
    endDate: Date
): Promise<number | null> {
    const availabilities = await RoomAvailable.find({
        roomId: new mongoose.Types.ObjectId(roomId),
        date: { $gte: startDate, $lt: endDate }
    }).select('price');

    if (availabilities.length === 0) {
        return null;
    }

    const totalPrice = availabilities.reduce((sum, record) => sum + record.price, 0);
    return Math.round(totalPrice / availabilities.length);
}
