import { Types } from 'mongoose';

export interface RoomData {
    id?: string;
    name: string;
    roomType: 'Single' | 'Double' | 'Suite';
    description?: string;
    amenities: Types.ObjectId[];
    price: number;
    images: string[];
    maxGuests: number;
    quantity: number;
}

export interface GetAllRoomsInput {
    filter?: Record<string, any>;
    page?: number;
    pageSize?: number;
}

export interface RoomIdInput {
    id: string;
}