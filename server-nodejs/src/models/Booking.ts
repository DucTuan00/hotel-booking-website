import mongoose, { Schema, Document, Types } from 'mongoose';

interface Guests {
    adults: number;
    children?: number;
}

interface BookingInterface extends Document {
    userId: Types.ObjectId;
    roomId: Types.ObjectId;
    checkIn: Date;
    checkOut: Date;
    guests: Guests;
    quantity: number;
    totalPrice: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

const bookingSchema: Schema = new mongoose.Schema({
    userId: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    roomId: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Room', 
        required: true 
    }, 
    checkIn: { 
        type: Date, 
        required: true 
    },
    checkOut: { 
        type: Date, 
        required: true 
    },
    guests: { 
        adults: { 
            type: Number, 
            required: true, 
            min: 1 
        },
        children: { 
            type: Number, 
            default: 0 
        },
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }, 
    totalPrice: { 
        type: Number, 
        required: true 
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });

const Booking = mongoose.model<BookingInterface>('Booking', bookingSchema);

export default Booking;
