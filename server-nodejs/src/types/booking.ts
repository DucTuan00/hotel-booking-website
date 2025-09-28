export enum BookingStatus {
    PENDING = 'Pending',
    CONFIRMED = 'Confirmed',
    CANCELLED = 'Cancelled',
    COMPLETED = 'Completed',
    REJECTED = 'Rejected'
}

export enum PaymentMethod {
    ONLINE = 'Online',
    ONSITE = 'Onsite'
}

export enum PaymentStatus {
    PAID = 'Paid',
    UNPAID = 'Unpaid',
    REFUNDED = 'Refunded'
}

export interface CreateBookingInput {
    userId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: { 
        adults: number; 
        children?: number 
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
    filter?: Record<string, any>;
    page?: number;
    pageSize?: number;
}