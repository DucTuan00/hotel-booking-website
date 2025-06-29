import mongoose, { Schema, Document, Types } from 'mongoose';

interface RoomInterface extends Document {
    name: string;
    roomType: 'Single' | 'Double' | 'Suite';
    description?: string;
    amenities: Types.ObjectId[];
    price: number;
    images: string[];
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
    amenities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Amenity',
    }], 
    price: { 
        type: Number, 
        required: true 
    }, 
    images: [String],
    maxGuests: { 
        type: Number, 
        required: true 
    }, 
    // availability: {
    //     start_date: {
    //         type: Date,
    //         required: true
    //     },
    //     end_date: {
    //         type: Date,
    //         required: true
    //     },
    //     is_available: {
    //         type: Boolean,
    //         default: true
    //     }
    // },
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
