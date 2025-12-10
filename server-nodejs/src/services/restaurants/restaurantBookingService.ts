import RestaurantBooking from '@/models/RestaurantBooking';
import { 
    CreateRestaurantBookingInput, 
    GetAllRestaurantBookingsInput, 
    RestaurantBookingDetail 
} from '@/types/restaurant';
import { mapId } from '@/utils/mapId';
import ApiError from '@/utils/apiError';

export async function createRestaurantBooking(
    userId: string, 
    input: CreateRestaurantBookingInput
) {
    const { fullName, phone, bookingDate, content } = input;

    // Validate booking date is not in the past
    const bookingDateObj = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDateObj < today) {
        throw new ApiError('Booking date cannot be in the past', 400);
    }

    const newBooking = new RestaurantBooking({
        userId,
        fullName,
        phone,
        bookingDate: bookingDateObj,
        content
    });

    await newBooking.save();

    return mapId(newBooking.toObject());
}

export async function getAllRestaurantBookings(
    input: GetAllRestaurantBookingsInput = {}
) {
    const { page = 1, pageSize = 10 } = input;
    const skip = (page - 1) * pageSize;

    const [bookings, total] = await Promise.all([
        RestaurantBooking.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean(),
        RestaurantBooking.countDocuments()
    ]);

    return {
        bookings: bookings.map(booking => mapId(booking)),
        total,
        currentPage: page,
        pageSize
    };
}

export async function getRestaurantBookingById(id: string) {
    const booking = await RestaurantBooking.findById(id).lean();

    if (!booking) {
        throw new ApiError('Restaurant booking not found', 404);
    }

    return mapId(booking);
}
