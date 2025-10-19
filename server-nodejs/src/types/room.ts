export enum RoomType {
    SINGLE = 'Single',
    DOUBLE = 'Double',
    SUITE = 'Suite',
}

export interface RoomData {
    id?: string;
    name: string;
    roomType: RoomType;
    description?: string;
    amenities: string[];
    price: number;
    images: string[];
    maxGuests: number;
    quantity: number;
    roomArea?: number;
    active?: boolean;
}

export interface RoomResponse {
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
    deletedAt?: Date | null;
}

export interface GetAllRoomsResponse {
    rooms: RoomResponse[];
    total: number;
    currentPage: number;
    pageSize: number;
}

export interface GetAllRoomsInput {
    filter?: {
        search?: string; 
    };
    page?: number;
    pageSize?: number;
}

export interface RoomIdInput {
    id: string;
}

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