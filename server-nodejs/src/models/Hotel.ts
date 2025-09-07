import mongoose, { Schema, Document } from 'mongoose';

interface HotelInterface extends Document {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    description: string;
    starRating: number;
    checkInTime: string;
    checkOutTime: string;
    mapsLink?: string;
}

const hotelSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    starRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    checkInTime: {
        type: String,
        required: true,
    },
    checkOutTime: {
        type: String,
        required: true,
    },
    mapsLink: {
        type: String,
    },
}, { 
    timestamps: true 
});

const Hotel = mongoose.model<HotelInterface>('Amenity', hotelSchema);

export default Hotel;
