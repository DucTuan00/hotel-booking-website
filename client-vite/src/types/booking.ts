export enum BookingStatus {
    PENDING = 'Pending',
    CONFIRMED = 'Confirmed',
    CANCELLED = 'Cancelled',
    COMPLETED = 'Completed',
    REJECTED = 'Rejected'
}

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
    status: BookingStatus;
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
    status: BookingStatus;
}