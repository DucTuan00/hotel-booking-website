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

// Sort & Filter Types
export type BookingSortField = 'createdAt' | 'checkIn' | 'checkOut' | 'totalPrice';
export type SortOrder = 'asc' | 'desc';

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
        children?: number;
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

export interface GetAllBookingsResponse {
    bookings: Booking[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface CelebrateItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    imagePath?: string;
}

export interface BookingCelebrateItem {
    id: string;
    celebrateItem: CelebrateItem;
    quantity: number;
    priceSnapshot: number;
}

export interface Booking {
    id: string;
    userId: string | { id: string; name: string; email: string };
    roomId: string | { id: string; name: string; roomType: string; price: number };
    checkIn: string;
    checkOut: string;
    guests: {
        adults: number;
        children?: number;
    };
    quantity: number;
    totalPrice: number;
    status: BookingStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    confirmedAt?: string;
    rejectedAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    paidAt?: string;
    paymentIntentId?: string;
    refundedAt?: string;
    snapshot?: {
        room: {
            id: string;
            name: string;
            roomType: string;
            roomArea?: number;
            description?: string;
            maxGuests: number;
            basePrice: number;
        };
        dailyRates: Array<{
            date: string;
            price: number;
        }>;
        celebrateItems: Array<{
            id: string;
            name: string;
            price: number;
            quantity: number;
            subtotal: number;
        }>;
        pricing: {
            roomSubtotal: number;
            celebrateItemsSubtotal: number;
            total: number;
        };
        bookingDate: string;
    };
    celebrateItems?: BookingCelebrateItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface PreviewPriceResponse {
    available: boolean;
    roomSubtotal: number;
    celebrateItemsSubtotal: number;
    totalPrice: number;
    dailyBreakdown: Array<{
        date: string;
        price: number;
    }>;
    celebrateItemsDetails: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        subtotal: number;
    }>;
}