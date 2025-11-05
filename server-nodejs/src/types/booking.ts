export enum BookingStatus {
    PENDING = 'Pending',
    CONFIRMED = 'Confirmed',
    CANCELLED = 'Cancelled',
    CHECKED_IN = 'CheckedIn',
    CHECKED_OUT = 'CheckedOut',
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

export interface CelebrateItemInput {
    celebrateItemId: string;
    quantity: number;
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
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    paymentMethod: PaymentMethod;
    celebrateItems?: CelebrateItemInput[];
}

export interface BookingIdInput {
    bookingId: string;
    cancellationReason?: string;
}

export interface UserIdInput {
    userId: string;
}

export interface UpdateBookingInput {
    bookingId: string;
    status: BookingStatus;
}

export type BookingSortField = 'createdAt' | 'checkIn' | 'checkOut' | 'totalPrice';
export type SortOrder = 'asc' | 'desc';

export interface GetAllBookingsInput {
    search?: string;
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    sortBy?: BookingSortField;
    sortOrder?: SortOrder;
    page?: number;
    pageSize?: number;
}