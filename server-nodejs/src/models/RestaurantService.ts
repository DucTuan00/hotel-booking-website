import mongoose, { Schema, Document, Types } from 'mongoose';

interface RestaurantServiceInterface extends Document {
    restaurantId: Types.ObjectId;
    imagePath: string;
    title: string;
    description?: string;
    price?: number;
    deletedAt?: Date;
}

const restaurantServiceSchema: Schema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    imagePath: {
        type: String,
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
    collection: 'restaurant_services' 
});

const RestaurantService = mongoose.model<RestaurantServiceInterface>('RestaurantService', restaurantServiceSchema);

export default RestaurantService;