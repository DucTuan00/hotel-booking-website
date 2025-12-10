export interface Spa {
    id: string;
    information: string;
}

export interface CreateSpaServiceInput {
    title: string;
    description?: string;
    price?: number;
    imagePath?: string;
}

export interface UpdateSpaServiceInput extends CreateSpaServiceInput {
    id: string;
}

export interface SpaServiceIdInput {
    id: string;
}

export interface GetAllSpaServicesResponse {
    services: SpaService[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface SpaService {
    id: string;
    spaId: string;
    title: string;
    description?: string;
    price?: number;
    imagePath?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateSpaImageInput {
    imagePath: string;
    title?: string;
    description?: string;
}

export interface GetAllSpaImagesResponse {
    images: SpaImage[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface SpaImage {
    id: string;
    spaId: string;
    imagePath: string;
    title?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Spa Booking Types
export interface CreateSpaBookingInput {
    fullName: string;
    phone: string;
    bookingDate: string;
    content?: string;
}

export interface SpaBooking {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    bookingDate: Date;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetAllSpaBookingsResponse {
    bookings: SpaBooking[];
    total: number;
    currentPage: number;
    pageSize: number;
}