import SpaBooking from '@/models/SpaBooking';
import { 
    CreateSpaBookingInput, 
    GetAllSpaBookingsInput, 
    SpaBookingDetail 
} from '@/types/spa';
import { mapId } from '@/utils/mapId';
import ApiError from '@/utils/apiError';

export async function createSpaBooking(
    userId: string, 
    input: CreateSpaBookingInput
) {
    const { fullName, phone, bookingDate, content } = input;

    // Validate booking date is not in the past
    const bookingDateObj = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDateObj < today) {
        throw new ApiError('Booking date cannot be in the past', 400);
    }

    const newBooking = new SpaBooking({
        userId,
        fullName,
        phone,
        bookingDate: bookingDateObj,
        content
    });

    await newBooking.save();

    return mapId(newBooking.toObject());
}

export async function getAllSpaBookings(
    input: GetAllSpaBookingsInput = {}
) {
    const { page = 1, pageSize = 10 } = input;
    const skip = (page - 1) * pageSize;

    const [bookings, total] = await Promise.all([
        SpaBooking.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .lean(),
        SpaBooking.countDocuments()
    ]);

    return {
        bookings: bookings.map(booking => mapId(booking)),
        total,
        currentPage: page,
        pageSize
    };
}

export async function getSpaBookingById(id: string) {
    const booking = await SpaBooking.findById(id).lean();

    if (!booking) {
        throw new ApiError('Spa booking not found', 404);
    }

    return mapId(booking);
}
