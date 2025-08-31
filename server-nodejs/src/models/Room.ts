import mongoose, { Schema, Document, Types } from 'mongoose';

interface RoomInterface extends Document {
    name: string;
    roomType: 'Single' | 'Double' | 'Suite';
    description?: string;
    price: number;
    maxGuests: number;
    quantity: number;
    active: boolean;
}

const roomSchema: Schema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, 
    roomType: {
        type: String,
        enum: ['Single', 'Double', 'Suite'],
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
        default: true
    }
}, { timestamps: true });

const Room = mongoose.model<RoomInterface>('Room', roomSchema);

export default Room;
