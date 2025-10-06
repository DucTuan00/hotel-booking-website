import mongoose, { Schema, Document, Types } from 'mongoose';

interface ReviewInterface extends Document {
    bookingId: Types.ObjectId;
    userId: Types.ObjectId;
    roomId: Types.ObjectId;
    rating: number;
    comment?: string;
    deletedAt?: Date;
}

const reviewSchema: Schema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
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
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { 
    timestamps: true,
    collection: 'reviews' 
});

const Review = mongoose.model<ReviewInterface>('Review', reviewSchema);

export default Review;