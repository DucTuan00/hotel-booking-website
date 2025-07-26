export interface CreateBookingInput {
    userId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: {
        adults: number;
        children?: number;
    };
    quantity: number;
}

export interface BookingIdInput {
    bookingId: string;
}

export interface UserIdInput {
    userId: string;
}

export interface UpdateBookingInput {
    bookingId: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

export interface GetAllBookingsInput {
    filter?: Record<string, unknown>;
    page?: number;
    pageSize?: number;
}

export interface GetAllBookingsResponse {
    bookings: Booking[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface Booking {
    id: string;
    userId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: {
        adults: number;
        children?: number;
    };
    quantity: number;
    totalPrice: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}