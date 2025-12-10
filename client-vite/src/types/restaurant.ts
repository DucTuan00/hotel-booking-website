export interface Restaurant {
    id: string;
    information: string;
}

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

export interface GetAllRestaurantServicesResponse {
    services: RestaurantService[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

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

export interface CreateRestaurantImageInput {
    imagePath: string;
    title?: string;
    description?: string;
}

export interface GetAllRestaurantImagesResponse {
    images: RestaurantImage[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface RestaurantImage {
    id: string;
    restaurantId: string;
    imagePath: string;
    title?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Restaurant Booking Types
export interface CreateRestaurantBookingInput {
    fullName: string;
    phone: string;
    bookingDate: string;
    content?: string;
}

export interface RestaurantBooking {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    bookingDate: Date;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetAllRestaurantBookingsResponse {
    bookings: RestaurantBooking[];
    total: number;
    currentPage: number;
    pageSize: number;
}