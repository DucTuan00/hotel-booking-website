import RoomAvailable from '@/models/RoomAvailable';
import Room from '@/models/Room';
import CelebrateItem from '@/models/CelebrateItem';
import { BookingStatus } from '@/types/booking';
import ApiError from '@/utils/apiError';
import mongoose from 'mongoose';

/**
 * Calculate number of nights between check-in and check-out dates
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / oneDay);
    return nights;
}

/**
 * Normalize date to UTC start of day (00:00:00.000)
 */
export function normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized;
}

/**
 * Get array of dates between check-in and check-out (excluding check-out day)
 * For booking: 19/10 -> 20/10 (1 night) -> returns [19/10]
 */
export function getBookingDates(checkIn: Date, checkOut: Date): Date[] {
    const dates: Date[] = [];
    const current = normalizeDate(checkIn);
    const end = normalizeDate(checkOut);
    
    while (current < end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    
    return dates;
}

/**
 * Check room availability and return price breakdown for booking dates
 */
export async function checkAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    quantity: number
): Promise<{
    available: boolean;
    dailyRates: Array<{
        date: Date;
        price: number;
        inventory: number;
    }>;
    message?: string;
}> {
    const bookingDates = getBookingDates(checkIn, checkOut);
    const dailyRates: Array<{ date: Date; price: number; inventory: number }> = [];

    // Check each night
    for (const date of bookingDates) {
        const roomAvailable = await RoomAvailable.findOne({
            roomId: new mongoose.Types.ObjectId(roomId),
            date: normalizeDate(date)
        });

        if (!roomAvailable) {
            return {
                available: false,
                dailyRates: [],
                message: `Room not available for date ${date.toISOString().split('T')[0]}. Please select different dates.`
            };
        }

        if (roomAvailable.inventory < quantity) {
            return {
                available: false,
                dailyRates: [],
                message: `Not enough rooms available for date ${date.toISOString().split('T')[0]}. Only ${roomAvailable.inventory} room(s) left.`
            };
        }

        dailyRates.push({
            date: normalizeDate(date),
            price: roomAvailable.price,
            inventory: roomAvailable.inventory
        });
    }

    return {
        available: true,
        dailyRates
    };
}

/**
 * Calculate total price for booking with dynamic pricing
 */
export async function calculateBookingPrice(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    quantity: number,
    celebrateItemIds?: Array<{ celebrateItemId: string; quantity: number }>
): Promise<{
    roomSubtotal: number;
    celebrateItemsSubtotal: number;
    totalPrice: number;
    dailyRates: Array<{ date: Date; price: number }>;
    celebrateItemsDetails: Array<{ id: string; name: string; price: number; quantity: number; subtotal: number }>;
}> {
    // Get room prices
    const { available, dailyRates } = await checkAvailability(roomId, checkIn, checkOut, quantity);
    
    if (!available) {
        throw new ApiError('Room not available for selected dates', 400);
    }

    // Calculate room subtotal (dynamic pricing per night)
    const roomSubtotal = dailyRates.reduce((total, rate) => {
        return total + (rate.price * quantity);
    }, 0);

    // Calculate celebrate items subtotal
    let celebrateItemsSubtotal = 0;
    const celebrateItemsDetails: Array<{ id: string; name: string; price: number; quantity: number; subtotal: number }> = [];

    if (celebrateItemIds && celebrateItemIds.length > 0) {
        for (const item of celebrateItemIds) {
            const celebrateItem = await CelebrateItem.findById(item.celebrateItemId);
            
            if (!celebrateItem) {
                throw new ApiError(`Celebrate item ${item.celebrateItemId} not found`, 404);
            }

            const subtotal = celebrateItem.price * item.quantity;
            celebrateItemsSubtotal += subtotal;

            celebrateItemsDetails.push({
                id: (celebrateItem._id as mongoose.Types.ObjectId).toString(),
                name: celebrateItem.name,
                price: celebrateItem.price,
                quantity: item.quantity,
                subtotal
            });
        }
    }

    return {
        roomSubtotal,
        celebrateItemsSubtotal,
        totalPrice: roomSubtotal + celebrateItemsSubtotal,
        dailyRates: dailyRates.map(rate => ({ date: rate.date, price: rate.price })),
        celebrateItemsDetails
    };
}

/**
 * Update room inventory (decrease or increase)
 * @param operation 'decrease' to book, 'increase' to cancel/reject
 */
export async function updateInventory(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    quantity: number,
    operation: 'decrease' | 'increase',
    session?: mongoose.ClientSession
): Promise<void> {
    const bookingDates = getBookingDates(checkIn, checkOut);

    for (const date of bookingDates) {
        const normalizedDate = normalizeDate(date);
        
        if (operation === 'decrease') {
            // Decrease inventory (booking)
            const result = await RoomAvailable.updateOne(
                {
                    roomId: new mongoose.Types.ObjectId(roomId),
                    date: normalizedDate,
                    inventory: { $gte: quantity } // Ensure enough inventory
                },
                { $inc: { inventory: -quantity } },
                { session }
            );

            if (result.modifiedCount === 0) {
                throw new ApiError(`Failed to update inventory for date ${date.toISOString().split('T')[0]}. Room may be fully booked.`, 400);
            }
        } else {
            // Increase inventory (cancel/reject)
            await RoomAvailable.updateOne(
                {
                    roomId: new mongoose.Types.ObjectId(roomId),
                    date: normalizedDate
                },
                { $inc: { inventory: quantity } },
                { session }
            );
        }
    }
}

/**
 * Calculate cancellation fee based on time until check-in
 */
export function calculateCancellationFee(
    booking: any
): {
    canCancel: boolean;
    feePercentage: number;
    fee: number;
    refundAmount: number;
    restoreInventory: boolean;
    reason?: string;
} {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    
    // Check if already checked in
    if (booking.status === BookingStatus.CHECKED_IN) {
        return {
            canCancel: false,
            feePercentage: 0,
            fee: 0,
            refundAmount: 0,
            restoreInventory: false,
            reason: 'Cannot cancel booking after check-in'
        };
    }

    // Check if already checked out
    if (booking.status === BookingStatus.CHECKED_OUT) {
        return {
            canCancel: false,
            feePercentage: 0,
            fee: 0,
            refundAmount: 0,
            restoreInventory: false,
            reason: 'Cannot cancel completed booking'
        };
    }

    // Check if check-in date has passed
    if (now > checkIn) {
        return {
            canCancel: false,
            feePercentage: 0,
            fee: 0,
            refundAmount: 0,
            restoreInventory: false,
            reason: 'Cannot cancel booking after check-in date'
        };
    }

    // Calculate hours until check-in
    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let feePercentage = 0;
    let restoreInventory = true;

    // Cancellation policy
    if (hoursUntilCheckIn > 7 * 24) {
        // > 7 days: Free cancellation
        feePercentage = 0;
    } else if (hoursUntilCheckIn > 3 * 24) {
        // 3-7 days: 20% fee
        feePercentage = 20;
    } else if (hoursUntilCheckIn > 24) {
        // 24h-3 days: 50% fee
        feePercentage = 50;
    } else {
        // < 24h: 100% fee, no inventory restore
        feePercentage = 100;
        restoreInventory = false;
    }

    const fee = (booking.totalPrice * feePercentage) / 100;
    const refundAmount = booking.totalPrice - fee;

    return {
        canCancel: true,
        feePercentage,
        fee,
        refundAmount,
        restoreInventory
    };
}

/**
 * Create booking snapshot with room and celebrate items details
 */
export async function createBookingSnapshot(
    room: any,
    dailyRates: Array<{ date: Date; price: number }>,
    celebrateItemsDetails: Array<{ id: string; name: string; price: number; quantity: number; subtotal: number }>,
    pricing: { roomSubtotal: number; celebrateItemsSubtotal: number; totalPrice: number }
): Promise<Record<string, any>> {
    return {
        room: {
            id: room._id.toString(),
            name: room.name,
            roomType: room.roomType,
            roomArea: room.roomArea,
            description: room.description,
            maxGuests: room.maxGuests,
            basePrice: room.price
        },
        dailyRates: dailyRates.map(rate => ({
            date: rate.date.toISOString().split('T')[0],
            price: rate.price
        })),
        celebrateItems: celebrateItemsDetails.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal
        })),
        pricing: {
            roomSubtotal: pricing.roomSubtotal,
            celebrateItemsSubtotal: pricing.celebrateItemsSubtotal,
            total: pricing.totalPrice
        },
        bookingDate: new Date()
    };
}
