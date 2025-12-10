import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurantBooking extends Document {
    userId: mongoose.Types.ObjectId;
    fullName: string;
    phone: string;
    bookingDate: Date;
    content?: string;
    createdAt: Date;
    updatedAt: Date;
}

const RestaurantBookingSchema = new Schema<IRestaurantBooking>(
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
        collection: 'restaurant_bookings' 
    }
);

export default mongoose.model<IRestaurantBooking>('RestaurantBooking', RestaurantBookingSchema);
