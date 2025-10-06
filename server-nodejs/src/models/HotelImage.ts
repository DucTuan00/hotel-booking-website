import mongoose, { Schema, Document, Types } from 'mongoose';

interface HotelImageInterface extends Document {
    hotelId: Types.ObjectId;
    imagePath: string;
    title?: string;
    description?: string;
    isMain: boolean;
    priority: number;
    deletedAt?: Date;
}

const hotelImageSchema: Schema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    isMain: {
        type: Boolean,
        default: false
    },
    priority: {
        type: Number,
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { 
    timestamps: true,
    collection: 'hotel_images' 
});

const HotelImage = mongoose.model<HotelImageInterface>('HotelImage', hotelImageSchema);

export default HotelImage;