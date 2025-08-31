import { Types } from 'mongoose';

export interface RoomData {
    id?: string;
    name: string;
    roomType: 'Single' | 'Double' | 'Suite';
    description?: string;
    amenities: string[];
    price: number;
    images: string[];
    maxGuests: number;
    quantity: number;
}

export interface RoomResponse {
    id: string;
    name: string;
    roomType: 'Single' | 'Double' | 'Suite';
    description?: string;
    amenities: any[];
    price: number;
    images: Array<{
        id: string;
        path: string;
    }>; 
    maxGuests: number;
    quantity: number;
    active: boolean;
}

export interface GetAllRoomsInput {
    filter?: Record<string, any>;
    page?: number;
    pageSize?: number;
}

export interface RoomIdInput {
    id: string;
}