import mongoose, { Schema, Document, Types } from 'mongoose';

interface BookingItemInterface extends Document {
    bookingId: Types.ObjectId;
    name: string;
    description?: string;
    price: number;
    imagePath?: string;
}

const bookingItemSchema: Schema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    imagePath: {
        type: String
    }
}, { 
    timestamps: true,
    collection: 'booking_items' 
});

const BookingItem = mongoose.model<BookingItemInterface>('BookingItem', bookingItemSchema);

export default BookingItem;