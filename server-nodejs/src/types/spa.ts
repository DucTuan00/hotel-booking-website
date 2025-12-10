// MARK: Interface
export interface Spa {
    information: string;
}

export interface SpaService {
    spaId: string;
    title: string;
    description?: string;
    price?: number;
    imagePath?: string;
    deletedAt?: Date;
}

export interface SpaImage {
    spaId: string;
    imagePath: string;
    title?: string;
    description?: string;
    deletedAt?: Date;
}

// MARK: Input
export interface CreateSpaServiceInput {
    title: string;
    description?: string;
    price?: number;
    imagePath?: string;
}

export interface UpdateSpaServiceInput extends CreateSpaServiceInput {
    id: string;
}

export interface CreateSpaImageInput {
    imagePath: string;
    title?: string;
    description?: string;
}

// MARK: Spa Booking Input
export interface CreateSpaBookingInput {
    fullName: string;
    phone: string;
    bookingDate: string; // ISO date string
    content?: string;
}

export interface GetAllSpaBookingsInput {
    page?: number;
    pageSize?: number;
}

export interface SpaBookingIdInput {
    id: string;
}

// MARK: Spa Booking Response
export interface GetAllSpaBookingsResponse {
    bookings: SpaBookingDetail[];
    total: number;
    currentPage: number;
    pageSize: number;
}

// MARK: Spa Booking Interface
export interface SpaBookingDetail {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    bookingDate: Date;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
}