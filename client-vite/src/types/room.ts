export enum RoomType {
    SINGLE = 'Single',
    DOUBLE = 'Double',
    SUITE = 'Suite',
}

export type RoomSortField = 'price' | 'name' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface CreateRoomInput {
    name: string;
    roomType: RoomType;
    description?: string;
    amenities: string[];
    price: number;
    images?: string[];
    maxGuests: number;
    quantity: number;
    roomArea?: number;
}

export interface RoomIdInput {
    id: string;
}

export interface UpdateRoomInput extends CreateRoomInput {
    id: string;
}

export interface GetAllRoomsInput {
    search?: string;
    roomType?: RoomType;
    sortBy?: RoomSortField;
    sortOrder?: SortOrder;
    page?: number;
    pageSize?: number;
}

export interface GetAllRoomsResponse {
    rooms: Room[];
    total: number;
    currentPage: number;
    pageSize: number;
}

export interface Room {
    id: string;
    name: string;
    roomType: RoomType;
    description?: string;
    amenities: Array<{
        id: string;
        name: string;
    }>;
    price: number;
    images: Array<{
        id: string;
        path: string;
    }>;
    maxGuests: number;
    quantity: number;
    roomArea?: number;
    active: boolean;
    averageRating?: number;
    totalReviews?: number;
}

export interface RoomImage {
    id: string;
    roomId: string;
    imagePath: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Room Availability types
export interface RoomAvailableData {
    roomId: string;
    date: Date;
    price: number;
    inventory: number;
}

export interface RoomAvailableInput {
    roomId: string;
    startDate: Date;
    endDate: Date;
    price: number;
    inventory: number;
}

export interface GetRoomAvailableInput {
    roomId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
}

export interface UpdateRoomAvailableInput {
    roomId: string;
    date: Date;
    price?: number;
    inventory?: number;
}

export interface RoomAvailableResponse {
    id: string;
    roomId: string;
    room: {
        id: string;
        name: string;
        roomType: string;
    };
    date: Date;
    price: number;
    inventory: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RoomAvailabilityData {
    id: string;
    name: string;
    roomType: RoomType;
    defaultPrice: number;
    defaultInventory: number;
    availability: Array<{
        date: Date;
        price: number;
        inventory: number;
    }>;
}

export interface SearchRoomsInput {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    adults?: number;
    children?: number;
    roomType?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    sortBy?: RoomSortField;
    sortOrder?: SortOrder;
    page?: number;
    pageSize?: number;
}