export interface CreateRoomInput {
    name: string;
    roomType: 'Single' | 'Double' | 'Suite';
    description?: string;
    amenities: string[];
    price: number;
    images?: string[];
    maxGuests: number;
    quantity: number;
}

export interface RoomIdInput {
    id: string;
}

export interface UpdateRoomInput extends CreateRoomInput {
    id: string;
    existingImages?: string[];
}

export interface GetAllRoomsInput {
    filter?: Record<string, unknown>;
    page?: number;
    pageSize?: number;
}

export interface GetAllRoomsResponse {
    rooms: Room[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface Room {
    id: string;
    name: string;
    roomType: 'Single' | 'Double' | 'Suite';
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
    active: boolean;
}

export interface RoomImage {
    id: string;
    roomId: string;
    imagePath: string;
    createdAt?: Date;
    updatedAt?: Date;
}
