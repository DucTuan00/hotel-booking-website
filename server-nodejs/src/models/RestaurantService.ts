import mongoose, { Schema, Document, Types } from 'mongoose';

interface RestaurantImageInterface extends Document {
    restaurantId: Types.ObjectId;
    imagePath: string;
    title: string;
    description?: string;
    price?: number;
    deletedAt?: Date;
}

const restaurantImageSchema: Schema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { 
    timestamps: true,
    collection: 'restaurant_images' 
});

const RestaurantImage = mongoose.model<RestaurantImageInterface>('RestaurantImage', restaurantImageSchema);

export default RestaurantImage;