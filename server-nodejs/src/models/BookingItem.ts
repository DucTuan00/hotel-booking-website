import mongoose, { Schema, Document, Types } from 'mongoose';

interface BookingItemInterface extends Document {
    bookingId: Types.ObjectId;
    celebrateItemId: Types.ObjectId;
    quantity: number;
    priceSnapshot: number;
}

const bookingItemSchema: Schema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    celebrateItemId: {
        type: mongoose.Types.ObjectId,
        ref: 'CelebrateItem',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    priceSnapshot: {
        type: Number,
        required: true
    }
}, { 
    timestamps: true,
    collection: 'booking_items' 
});

const BookingItem = mongoose.model<BookingItemInterface>('BookingItem', bookingItemSchema);

export default BookingItem;