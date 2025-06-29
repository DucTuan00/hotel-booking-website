import Booking from '@/models/Booking';
import User from '@/models/User';
import Room from '@/models/Room';
import ApiError from '@/utils/apiError';

interface CreateBookingInput {
    user_id: string;
    room_id: string;
    check_in: string;
    check_out: string;
    guests: { 
        adults: number; 
        children?: number 
    };
    quantity: number;
}

interface BookingIdInput {
    booking_id: string;
}

interface UserIdInput {
    user_id: string;
}

interface UpdateBookingInput {
    booking_id: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

interface GetAllBookingsInput {
    filter?: Record<string, any>;
    page?: number;
    pageSize?: number;
}

const createBooking = async (args: CreateBookingInput) => {
    const { user_id, room_id, check_in, check_out, guests, quantity } = args;

    const existUser = await User.findById({ _id: user_id, active: true });
    if (!existUser) {
        throw new ApiError('User not found', 404);
    }

    const existRoom = await Room.findById({ _id: room_id, active: true });
    if (!existRoom) {
        throw new ApiError('Room not found', 404);
    }

    // if (!existRoom.availability.is_available) {
    //     throw new ApiError('Room not available', 400);
    // }

    if (!check_in || isNaN(new Date(check_in).getTime())) {
        throw new ApiError('Invalid chech in date', 400);
    }

    if (!check_out || isNaN(new Date(check_out).getTime())) {
        throw new ApiError('Invalid chech out date', 400);
    }

    if (isNaN(guests.adults) || isNaN(Number(guests.children)) || guests.adults <= 0 || (guests.children !== undefined && guests.children < 0)) {
        throw new ApiError("Invalid guests.", 400);
    }

    if (isNaN(quantity) || quantity <= 0) {
        throw new ApiError("Invalid quantity", 400);
    }

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const currentDate = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
    ));

    if (checkInDate < currentDate) {
        throw new ApiError('Check in date is in the past', 400);
    }

    if (checkInDate >= checkOutDate) {
        throw new ApiError('Check in date must not greater or equal than check out date', 400);
    }

    // Check empty rooms per day
    const existingBookings = await Booking.find({ room_id: existRoom.id });
    const bookingDays: Date[] = [];
    for (let d = new Date(checkInDate); d <= checkOutDate; d.setDate(d.getDate() + 1)) {
        bookingDays.push(new Date(d)); // push day to array
    }

    for (const day of bookingDays) {
        let bookedQuantityForDay = 0;
        for (const booking of existingBookings) {
            const existingCheckIn = new Date(booking.check_in);
            const existingCheckOut = new Date(booking.check_out);
            // If day in range of existed booking day => plus quantity for that day
            if (day >= existingCheckIn && day < existingCheckOut) {
                bookedQuantityForDay += booking.quantity;
            }
        }
        console.log(`So luong phong da dat cho ngay ${day}: ${bookedQuantityForDay}`);

        if (bookedQuantityForDay + quantity > existRoom.quantity) {
            throw new ApiError(`Not enough rooms available for the day ${day} and quantity.`, 400);
        }
    }

    const bookingDay = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const total_price = existRoom.price * bookingDay * quantity;

    const newBooking = new Booking({
        user_id: existUser.id,
        room_id: existRoom.id,
        check_in: checkInDate,
        check_out: checkOutDate,
        guests: guests,
        quantity: quantity,
        total_price: total_price,
        status: 'Pending'
    });

    const booking = await newBooking.save();

    if (!booking) {
        throw new ApiError('Failed to create booking', 500);
    }

    return booking;
};

const getBookingById = async (arg: BookingIdInput) => {
    const { booking_id } = arg;

    const booking = await Booking.findById(booking_id);

    if (!booking) {
        throw new ApiError('Booking not found', 404);

    }
    return booking;
};

const getBookingsByUserId = async (arg: UserIdInput) => {
    const { user_id } = arg;

    const bookings = await Booking.find({ user_id: user_id });

    if (!bookings) {
        throw new ApiError('Booking not found', 404);
    }

    return bookings;
};

const cancelBooking = async (arg: BookingIdInput) => {
    const { booking_id } = arg;

    const booking = await Booking.findById(booking_id);
    if (!booking) {
        throw new ApiError('Booking not found', 404);
    }

    if (booking.status === 'Cancelled') {
        throw new ApiError('Booking already cancelled', 400);
    }

    if (booking.status === 'Confirmed') {
        throw new ApiError('Booking already confirmed', 400);
    }

    const checkInDate = new Date(booking.check_in);
    const currentDate = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
    ));

    if (currentDate > checkInDate) {
        throw new ApiError('Booking can not be cancelled after check-in date', 400);
    }

    const oneDay = 24 * 60 * 60 * 1000;
    if (checkInDate.getTime() - currentDate.getTime() < oneDay) {
        throw new ApiError('Booking can not be cancelled within 24 hours of check-in', 400);
    }

    const cancelBooking = await Booking.findByIdAndUpdate(
        { _id: booking_id },
        { status: 'Cancelled' },
        { new: true, runValidators: true } // new:true to return updated doc, runValidators to validate status enum
    );

    return cancelBooking;
};

const getAllBookings = async (args: GetAllBookingsInput) => {
    const { filter = {}, page = 1, pageSize = 10 } = args;

    const skip = (page - 1) * pageSize;
    const bookings = await Booking.find({ ...filter })
        .populate({ path: 'user_id', select: 'name' })
        .populate({ path: 'room_id', select: 'name' })
        .skip(skip)
        .limit(pageSize);

    if (!bookings) {
        throw new ApiError('Failed to get bookings', 500);
    }

    const totalBookings = await Booking.countDocuments({ ...filter });
    if (!totalBookings) {
        throw new ApiError('Failed to get total bookings', 500);
    }
    return {
        bookings: bookings,
        total: totalBookings,
        currentPage: page,
        pageSize: pageSize
    };
};

const updateBooking = async (args: UpdateBookingInput) => {
    const { booking_id, status } = args;

    if (!status || !['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) {
        throw new ApiError('Invalid booking status provided.', 400);
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
        booking_id,
        { status: status },
        { new: true, runValidators: true } // new:true to return updated doc, runValidators to validate status enum
    );

    if (!updatedBooking) {
        throw new ApiError('Booking not found for update', 404);
    }

    return updatedBooking;
};

export default {
    createBooking,
    getBookingById,
    getBookingsByUserId,
    cancelBooking,
    getAllBookings,
    updateBooking,
};
