import Booking from '@/models/Booking';
import BookingItem from '@/models/BookingItem';
import User from '@/models/User';
import Room from '@/models/Room';
import CelebrateItem from '@/models/CelebrateItem';
import ApiError from '@/utils/apiError';
import { mapId, mapIds } from '@/utils/mapId';
import mongoose from 'mongoose';
import {
    CreateBookingInput,
    BookingIdInput,
    UserIdInput,
    GetAllBookingsInput,
    UpdateBookingInput,
    BookingStatus,
    PaymentMethod,
    PaymentStatus
} from '@/types/booking';
import {
    normalizeDate,
    checkAvailability,
    calculateBookingPrice,
    updateInventory,
    calculateCancellationFee,
    createBookingSnapshot
} from '@/utils/bookingHelpers';
import {
    getUserDiscount,
    calculateDiscountAmount,
    calculateFinalPrice,
    incrementUserBookingStats,
    updateUserLoyaltyTier
} from '@/services/loyalty/loyaltyService';

/**
 * Create a new booking with dynamic pricing, inventory management, and celebrate items
 */
export async function createBooking(args: CreateBookingInput) {
    const { 
        userId, 
        roomId, 
        checkIn, 
        checkOut, 
        guests, 
        quantity,
        firstName,
        lastName,
        email,
        phoneNumber,
        note,
        paymentMethod,
        celebrateItems = []
    } = args;

    // Validate user
    const existUser = await User.findById(userId);
    if (!existUser || !existUser.active) {
        throw new ApiError('User not found or inactive', 404);
    }

    // Validate room
    const existRoom = await Room.findById(roomId);
    if (!existRoom || !existRoom.active || existRoom.deletedAt) {
        throw new ApiError('Room not found or inactive', 404);
    }

    // Validate dates
    if (!checkIn || isNaN(new Date(checkIn).getTime())) {
        throw new ApiError('Invalid check-in date', 400);
    }

    if (!checkOut || isNaN(new Date(checkOut).getTime())) {
        throw new ApiError('Invalid check-out date', 400);
    }

    const checkInDate = normalizeDate(new Date(checkIn));
    const checkOutDate = normalizeDate(new Date(checkOut));
    const today = normalizeDate(new Date());

    if (checkInDate < today) {
        throw new ApiError('Check-in date cannot be in the past', 400);
    }

    if (checkInDate >= checkOutDate) {
        throw new ApiError('Check-out date must be after check-in date', 400);
    }

    // Validate guests
    const totalGuests = guests.adults + (guests.children || 0);
    const maxAllowedGuests = existRoom.maxGuests * quantity;

    if (guests.adults <= 0 || (guests.children !== undefined && guests.children < 0)) {
        throw new ApiError('Invalid number of guests', 400);
    }

    if (totalGuests > maxAllowedGuests) {
        throw new ApiError(
            `Total guests (${totalGuests}) exceeds maximum capacity (${maxAllowedGuests}) for ${quantity} room(s)`,
            400
        );
    }

    // Validate quantity
    if (isNaN(quantity) || quantity <= 0) {
        throw new ApiError('Invalid room quantity', 400);
    }

    // Validate contact info
    if (!firstName || !lastName || !email || !phoneNumber) {
        throw new ApiError('Contact information is required', 400);
    }

    // Check availability
    const availabilityCheck = await checkAvailability(roomId, checkInDate, checkOutDate, quantity);
    if (!availabilityCheck.available) {
        throw new ApiError(availabilityCheck.message || 'Room not available for selected dates', 400);
    }

    // Calculate pricing with celebrate items
    const pricing = await calculateBookingPrice(
        roomId,
        checkInDate,
        checkOutDate,
        quantity,
        celebrateItems
    );

    // Validate celebrate items if provided
    const celebrateItemsData: Array<{ item: any; quantity: number; price: number }> = [];
    if (celebrateItems && celebrateItems.length > 0) {
        for (const celebrateItemInput of celebrateItems) {
            const celebrateItem = await CelebrateItem.findById(celebrateItemInput.celebrateItemId);
            if (!celebrateItem) {
                throw new ApiError(`Celebrate item ${celebrateItemInput.celebrateItemId} not found`, 404);
            }
            if (celebrateItemInput.quantity <= 0) {
                throw new ApiError(`Invalid quantity for celebrate item ${celebrateItem.name}`, 400);
            }
            celebrateItemsData.push({
                item: celebrateItem,
                quantity: celebrateItemInput.quantity,
                price: celebrateItem.price
            });
        }
    }

    // Create booking snapshot
    const snapshot = await createBookingSnapshot(
        existRoom,
        pricing.dailyRates,
        pricing.celebrateItemsDetails,
        {
            roomSubtotal: pricing.roomSubtotal,
            celebrateItemsSubtotal: pricing.celebrateItemsSubtotal,
            totalPrice: pricing.totalPrice
        }
    );

    // Determine booking status and payment status
    let bookingStatus = BookingStatus.PENDING;
    let paymentStatus = PaymentStatus.UNPAID;

    // Get user's loyalty discount and calculate final price
    const userDiscount = await getUserDiscount(userId);
    const originalPrice = pricing.totalPrice;
    const discountAmount = calculateDiscountAmount(originalPrice, userDiscount);
    const finalPrice = calculateFinalPrice(originalPrice, userDiscount);

    // Add loyalty discount info to snapshot for tracking
    snapshot.loyaltyDiscount = {
        tier: existUser.loyaltyTier || 'Bronze',
        discountPercent: userDiscount,
        originalPrice: originalPrice,
        discountAmount: discountAmount,
        finalPrice: finalPrice
    };

    // Start MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newBooking = new Booking({
            userId: existUser._id,
            roomId: existRoom._id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: guests,
            quantity: quantity,
            totalPrice: finalPrice,
            status: bookingStatus,
            firstName,
            lastName,
            email,
            phoneNumber,
            note,
            paymentMethod,
            paymentStatus,
            snapshot
        });

        const savedBooking = await newBooking.save({ session });

        // Create booking items for celebrate items
        if (celebrateItemsData.length > 0) {
            const bookingItemsToCreate = celebrateItemsData.map(celebrateData => ({
                bookingId: savedBooking._id,
                celebrateItemId: celebrateData.item._id,
                quantity: celebrateData.quantity,
                priceSnapshot: celebrateData.price
            }));

            await BookingItem.insertMany(bookingItemsToCreate, { session });
        }

        // Decrease inventory (lock rooms immediately when booking is PENDING)
        await updateInventory(
            roomId,
            checkInDate,
            checkOutDate,
            quantity,
            'decrease',
            session
        );

        await session.commitTransaction();

        return mapId(savedBooking);
    } catch (error: any) {
        // Rollback transaction on error
        await session.abortTransaction();
        throw new ApiError(error.message || 'Failed to create booking', error.statusCode || 500);
    } finally {
        session.endSession();
    }
}

/**
 * Get booking by ID with populated data
 */
export async function getBookingById(arg: BookingIdInput) {
    const { bookingId } = arg;

    const booking = await Booking.findById(bookingId)
        .populate({ path: 'userId', select: 'name email' })
        .populate({ path: 'roomId', select: 'name roomType price' });

    if (!booking) {
        throw new ApiError('Booking not found', 404);
    }

    // Get celebrate items if any
    const bookingItems = await BookingItem.find({ bookingId: booking._id })
        .populate({ path: 'celebrateItemId', select: 'name description imagePath' });

    const bookingData = mapId(booking);

    return {
        ...bookingData,
        celebrateItems: bookingItems.map(item => ({
            id: (item._id as mongoose.Types.ObjectId).toString(),
            celebrateItem: mapId(item.celebrateItemId),
            quantity: item.quantity,
            priceSnapshot: item.priceSnapshot
        }))
    };
}

/**
 * Get all bookings for a specific user
 */
export async function getBookingsByUserId(arg: UserIdInput & { search?: string; status?: string; paymentStatus?: string; page?: number; pageSize?: number }) {
    const { userId, search, status, paymentStatus, page = 1, pageSize = 10 } = arg;

    const buildQuery = () => {
        let query: any = { userId: userId };

        if (search) {
            const searchText = search.trim();
            
            // Search by booking ID or room name
            if (mongoose.Types.ObjectId.isValid(searchText) && searchText.length === 24) {
                query._id = searchText;
            } else {
                query.searchText = searchText;
            }
        }

        if (status) {
            query.status = status;
        }

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        return query;
    };

    const queryConditions = buildQuery();
    const searchText = queryConditions.searchText;
    delete queryConditions.searchText; 
    
    const skip = (page - 1) * pageSize;

    // If searching by room name, we need to do a different approach
    let bookings, totalBookings;
    
    if (searchText) {
        // Get all room IDs that match the search text
        const rooms = await Room.find({ 
            name: new RegExp(searchText, 'i'),
            deletedAt: null 
        }).select('_id');
        const roomIds = rooms.map(room => room._id);
        
        // Add room filter to query
        if (roomIds.length > 0) {
            queryConditions.$or = [
                { _id: searchText }, 
                { roomId: { $in: roomIds } } 
            ];
        } else {
            queryConditions._id = searchText;
        }
    }

    [bookings, totalBookings] = await Promise.all([
        Booking.find(queryConditions)
            .populate({ path: 'roomId', select: 'name roomType price' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize),
        Booking.countDocuments(queryConditions)
    ]);

    if (!bookings) {
        throw new ApiError('No bookings found', 404);
    }

    return {
        bookings: mapIds(bookings),
        total: totalBookings,
        currentPage: page,
        pageSize: pageSize
    };
}

/**
 * Cancel booking with cancellation policy (for both user and admin)
 */
export async function cancelBooking(arg: BookingIdInput) {
    const { bookingId, cancellationReason } = arg;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError('Booking not found', 404);
    }

    // Check if already cancelled
    if (booking.status === BookingStatus.CANCELLED) {
        throw new ApiError('Booking is already cancelled', 400);
    }

    // Check if already rejected
    if (booking.status === BookingStatus.REJECTED) {
        throw new ApiError('Rejected bookings cannot be cancelled', 400);
    }

    // Calculate cancellation fee
    const cancellationInfo = calculateCancellationFee(booking);

    if (!cancellationInfo.canCancel) {
        throw new ApiError(cancellationInfo.reason || 'Cannot cancel this booking', 400);
    }

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Update booking status
        booking.status = BookingStatus.CANCELLED;
        booking.cancelledAt = new Date();
        
        booking.cancellationReason = cancellationReason || 
            `Cancelled. Fee: ${cancellationInfo.feePercentage}% (${cancellationInfo.fee} VND). Refund: ${cancellationInfo.refundAmount} VND.`;

        await booking.save({ session });

        // Restore inventory if applicable
        if (cancellationInfo.restoreInventory) {
            await updateInventory(
                booking.roomId.toString(),
                booking.checkIn,
                booking.checkOut,
                booking.quantity,
                'increase',
                session
            );
        }

        // If payment was made, process refund
        if (booking.paymentStatus === PaymentStatus.PAID) {
            // In real implementation, trigger refund via payment gateway
            // For now, just update status
            if (cancellationInfo.refundAmount > 0) {
                booking.paymentStatus = PaymentStatus.REFUNDED;
                booking.refundedAt = new Date();
            }
        }

        await booking.save({ session });

        await session.commitTransaction();

        // Fetch the updated booking with populated references
        const updatedBooking = await Booking.findById(bookingId)
            .populate({ path: 'userId', select: 'name email' })
            .populate({ path: 'roomId', select: 'name roomType price' });

        if (!updatedBooking) {
            throw new ApiError('Booking not found after cancellation', 404);
        }

        return {
            booking: { 
                ...mapId(updatedBooking) 
            },
            cancellationInfo: {
                fee: cancellationInfo.fee,
                feePercentage: cancellationInfo.feePercentage,
                refundAmount: cancellationInfo.refundAmount,
                inventoryRestored: cancellationInfo.restoreInventory
            }
        };
    } catch (error: any) {
        await session.abortTransaction();
        throw new ApiError(error.message || 'Failed to cancel booking', error.statusCode || 500);
    } finally {
        session.endSession();
    }
}

/**
 * Get all bookings (admin)
 */
export async function getAllBookings(args: GetAllBookingsInput) {
    const { search, status, paymentStatus, sortBy, sortOrder, page = 1, pageSize = 10 } = args;

    const buildQuery = () => {
        let query: any = {};

        if (search) {
            const searchText = search.trim();
            
            if (mongoose.Types.ObjectId.isValid(searchText) && searchText.length === 24) {
                query._id = searchText;
            } else {
                query.$or = [
                    { firstName: new RegExp(searchText, 'i') },
                    { lastName: new RegExp(searchText, 'i') },
                    { email: new RegExp(searchText, 'i') },
                    { phoneNumber: new RegExp(searchText, 'i') }
                ];
            }
        }

        if (status) {
            query.status = status;
        }

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        return query;
    };

    // Build sort object
    const buildSort = (): Record<string, 1 | -1> => {
        if (!sortBy || !sortOrder) {
            return { createdAt: -1 }; 
        }

        const order = sortOrder === 'asc' ? 1 : -1;
        return { [sortBy]: order };
    };

    const queryConditions = buildQuery();
    const sortConditions = buildSort();
    const skip = (page - 1) * pageSize;

    const [bookings, totalBookings] = await Promise.all([
        Booking.find(queryConditions)
            .populate({ path: 'userId', select: 'name email' })
            .populate({ path: 'roomId', select: 'name roomType price' })
            .sort(sortConditions)
            .skip(skip)
            .limit(pageSize),
        Booking.countDocuments(queryConditions)
    ]);

    if (!bookings) {
        throw new ApiError('Failed to get bookings', 500);
    }

    return {
        bookings: mapIds(bookings),
        total: totalBookings,
        currentPage: page,
        pageSize: pageSize
    };
}

/**
 * Update booking status (admin)
 */
export async function updateBooking(args: UpdateBookingInput) {
    const { bookingId, status } = args;

    if (!status || !Object.values(BookingStatus).includes(status)) {
        throw new ApiError('Invalid booking status provided', 400);
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError('Booking not found', 404);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const oldStatus = booking.status;

        // Update status
        booking.status = status;

        // Set timestamps based on status
        if (status === BookingStatus.CONFIRMED && !booking.confirmedAt) {
            booking.confirmedAt = new Date();
        } else if (status === BookingStatus.REJECTED && !booking.rejectedAt) {
            booking.rejectedAt = new Date();
            
            // Restore inventory when rejected
            await updateInventory(
                booking.roomId.toString(),
                booking.checkIn,
                booking.checkOut,
                booking.quantity,
                'increase',
                session
            );
        } else if (status === BookingStatus.CHECKED_IN) {
            // Validate can check in (must be confirmed first)
            if (oldStatus !== BookingStatus.CONFIRMED) {
                throw new ApiError('Can only check in confirmed bookings', 400);
            }
            // Check if payment is completed for ONSITE payment
            if (booking.paymentMethod === PaymentMethod.ONSITE && booking.paymentStatus !== PaymentStatus.PAID) {
                throw new ApiError('Payment must be completed before check-in for onsite payment', 400);
            }
            // Log check-in time
            if (!booking.checkedInAt) {
                booking.checkedInAt = new Date();
            }
        } else if (status === BookingStatus.CHECKED_OUT) {
            // Validate can check out (must be checked in first)
            if (oldStatus !== BookingStatus.CHECKED_IN) {
                throw new ApiError('Can only check out checked-in bookings', 400);
            }
            // Log check-out time
            if (!booking.checkedOutAt) {
                booking.checkedOutAt = new Date();
            }

            // Update user loyalty stats after successful checkout
            const bookingAmount = booking.totalPrice;
            await incrementUserBookingStats(
                booking.userId.toString(),
                bookingAmount
            );

            // Check and update user loyalty tier
            await updateUserLoyaltyTier(booking.userId.toString());
        }

        await booking.save({ session });

        await session.commitTransaction();

        const updatedBooking = await Booking.findById(bookingId)
            .populate({ path: 'userId', select: 'name email' })
            .populate({ path: 'roomId', select: 'name roomType price' });

        if (!updatedBooking) {
            throw new ApiError('Booking not found after update', 404);
        }

        return mapId(updatedBooking);
    } catch (error: any) {
        await session.abortTransaction();
        throw new ApiError(error.message || 'Failed to update booking', error.statusCode || 500);
    } finally {
        session.endSession();
    }
}

/**
 * Update payment status (for payment gateway callback)
 */
export async function updatePaymentStatus(
    bookingId: string,
    paymentStatus: PaymentStatus,
): Promise<any> {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError('Booking not found', 404);
    }

    booking.paymentStatus = paymentStatus;
    
    if (paymentStatus === PaymentStatus.PAID) {
        booking.paidAt = new Date();
        
        // Auto-confirm if payment is ONLINE and paid
        if (booking.paymentMethod === PaymentMethod.ONLINE && booking.status === BookingStatus.PENDING) {
            booking.status = BookingStatus.CONFIRMED;
            booking.confirmedAt = new Date();
        }
    }

    await booking.save();

    return mapId(booking);
}

/**
 * Preview booking price without creating booking (for frontend)
 */
export async function previewBookingPrice(args: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    quantity: number;
    celebrateItems?: Array<{ celebrateItemId: string; quantity: number }>;
}): Promise<any> {
    const { roomId, checkIn, checkOut, quantity, celebrateItems = [] } = args;

    // Validate dates
    if (!checkIn || isNaN(new Date(checkIn).getTime())) {
        throw new ApiError('Invalid check-in date', 400);
    }

    if (!checkOut || isNaN(new Date(checkOut).getTime())) {
        throw new ApiError('Invalid check-out date', 400);
    }

    const checkInDate = normalizeDate(new Date(checkIn));
    const checkOutDate = normalizeDate(new Date(checkOut));

    if (checkInDate >= checkOutDate) {
        throw new ApiError('Check-out date must be after check-in date', 400);
    }

    // Check availability
    const availabilityCheck = await checkAvailability(roomId, checkInDate, checkOutDate, quantity);
    if (!availabilityCheck.available) {
        throw new ApiError(availabilityCheck.message || 'Room not available for selected dates', 400);
    }

    // Calculate pricing
    const pricing = await calculateBookingPrice(
        roomId,
        checkInDate,
        checkOutDate,
        quantity,
        celebrateItems
    );

    return {
        available: true,
        roomSubtotal: pricing.roomSubtotal,
        celebrateItemsSubtotal: pricing.celebrateItemsSubtotal,
        totalPrice: pricing.totalPrice,
        dailyBreakdown: pricing.dailyRates.map(rate => ({
            date: rate.date.toISOString().split('T')[0],
            price: rate.price
        })),
        celebrateItemsDetails: pricing.celebrateItemsDetails
    };
}
