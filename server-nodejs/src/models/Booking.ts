import mongoose, { Schema, Document, Types } from 'mongoose';

interface Guests {
    adults: number;
    children?: number;
}

interface BookingInterface extends Document {
    user_id: Types.ObjectId;
    room_id: Types.ObjectId;
    check_in: Date;
    check_out: Date;
    guests: Guests;
    quantity: number;
    total_price: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

const bookingSchema: Schema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    room_id: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Room', 
        required: true 
    }, 
    check_in: { 
        type: Date, 
        required: true 
    },
    check_out: { 
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
    total_price: { 
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
