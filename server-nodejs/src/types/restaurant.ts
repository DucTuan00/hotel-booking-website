// MARK: Input
export interface CreateRestaurantServiceInput {
    title: string;
    description?: string;
    price?: number;
    imagePath?: string;
}

export interface UpdateRestaurantServiceInput extends CreateRestaurantServiceInput {
    id: string;
}

export interface RestaurantServiceIdInput {
    id: string;
}

export interface CreateRestaurantImageInput {
    imagePath: string;
    title?: string;
    description?: string;
}

// MARK: Response
export interface GetAllRestaurantServicesResponse {
    services: RestaurantService[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

// MARK: Interface
export interface RestaurantService {
    id: string;
    restaurantId: string;
    title: string;
    description?: string;
    price?: number;
    imagePath?: string;
    createdAt: Date;
    updatedAt: Date;
}

// MARK: Restaurant Booking Input
export interface CreateRestaurantBookingInput {
    fullName: string;
    phone: string;
    bookingDate: string; // ISO date string
    content?: string;
}

export interface GetAllRestaurantBookingsInput {
    page?: number;
    pageSize?: number;
}

export interface RestaurantBookingIdInput {
    id: string;
}

// MARK: Restaurant Booking Response
export interface GetAllRestaurantBookingsResponse {
    bookings: RestaurantBookingDetail[];
    total: number;
    currentPage: number;
    pageSize: number;
}

// MARK: Restaurant Booking Interface
export interface RestaurantBookingDetail {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    bookingDate: Date;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
}