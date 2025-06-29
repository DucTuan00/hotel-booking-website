export interface CreateBookingInput {
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

export interface BookingIdInput {
    booking_id: string;
}

export interface UserIdInput {
    user_id: string;
}

export interface UpdateBookingInput {
    booking_id: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

export interface GetAllBookingsInput {
    filter?: Record<string, any>;
    page?: number;
    pageSize?: number;
}