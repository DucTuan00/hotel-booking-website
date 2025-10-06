import mongoose, { Schema, Document, Types } from 'mongoose';

interface RestaurantInterface extends Document {
    information: string;
}

const restaurantSchema: Schema = new mongoose.Schema({
    information: {
        type: String,
        required: true,
    },
}, { 
    timestamps: true,
    collection: 'restaurants' 
});

const Restaurant = mongoose.model<RestaurantInterface>('Restaurant', restaurantSchema);

export default Restaurant;