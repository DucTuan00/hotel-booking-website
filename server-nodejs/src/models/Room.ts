import mongoose, { Schema, Document, Types } from 'mongoose';
import { RoomType } from '@/types/room';

interface RoomInterface extends Document {
    name: string;
    roomType: RoomType;
    description?: string;
    price: number;
    maxGuests: number;
    quantity: number;
    active: boolean;
    roomArea?: number;
    deletedAt?: Date;
}

const roomSchema: Schema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, 
    roomType: {
        type: String,
        enum: Object.values(RoomType),
        required: true
    },
    description: { 
        type: String 
    }, 
    price: { 
        type: Number, 
        required: true 
    }, 
    maxGuests: { 
        type: Number, 
        required: true 
    }, 
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    active: {
        type: Boolean,
        default: false
    },
    roomArea: {
        type: Number,
        min: 0
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Room = mongoose.model<RoomInterface>('Room', roomSchema);

export default Room;
