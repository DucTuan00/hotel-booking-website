// MARK: Enums
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

// MARK: Interfaces
export interface PaymentDetails {
    gateway?: 'vnpay' | 'momo' | 'zalopay'; // Payment gateway used
    transactionId?: string; // Transaction ID from gateway
    responseCode?: string; // Response code from gateway
    bankCode?: string; // Bank code (if applicable)
    cardType?: string; // Card type (if applicable)
    payDate?: string; // Payment date from gateway
    platform?: 'web' | 'mobile'; // Platform used for payment
    rawData?: Record<string, any>; // Raw response data from gateway
}

// MARK: Input
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
    note?: string;
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

export interface GetAllBookingsInput {
    search?: string;
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    sortBy?: BookingSortField;
    sortOrder?: SortOrder;
    page?: number;
    pageSize?: number;
}

// MARK: Type
export type BookingSortField = 'createdAt' | 'checkIn' | 'checkOut' | 'totalPrice';
export type SortOrder = 'asc' | 'desc';