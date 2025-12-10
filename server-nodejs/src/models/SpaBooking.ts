import mongoose, { Schema, Document } from 'mongoose';

export interface ISpaBooking extends Document {
    userId: mongoose.Types.ObjectId;
    fullName: string;
    phone: string;
    bookingDate: Date;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SpaBookingSchema = new Schema<ISpaBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        bookingDate: {
            type: Date,
            required: true
        },
        content: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        collection: 'spa_bookings' 
    }
);

export default mongoose.model<ISpaBooking>('SpaBooking', SpaBookingSchema);
