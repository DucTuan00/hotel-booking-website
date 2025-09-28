import mongoose, { Schema, Document, Types } from 'mongoose';
import { BookingStatus, PaymentMethod, PaymentStatus } from '@/types/booking';

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
    status: BookingStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    confirmedAt?: Date;
    rejectedAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
    paidAt?: Date;
    paymentIntentId?: string;
    refundedAt?: Date;
    snapshot: Record<string, any>;
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
        enum: Object.values(BookingStatus),
        default: BookingStatus.PENDING
    },
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        enum: Object.values(PaymentMethod), 
        required: true  
    },
    paymentStatus: { 
        type: String, 
        enum: Object.values(PaymentStatus), 
        default: PaymentStatus.UNPAID 
    },
    confirmedAt: { 
        type: Date 
    },
    rejectedAt: { 
        type: Date 
    },
    cancelledAt: { 
        type: Date 
    },
    cancellationReason: { 
        type: String 
    },
    paidAt: { 
        type: Date 
    },
    paymentIntentId: { 
        type: String 
    },
    refundedAt: { 
        type: Date 
    },
    snapshot: { 
        type: Schema.Types.Mixed, 
        required: true 
    },
}, { timestamps: true });

const Booking = mongoose.model<BookingInterface>('Booking', bookingSchema);

export default Booking;
