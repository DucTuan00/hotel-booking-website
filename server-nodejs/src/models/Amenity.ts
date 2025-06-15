import mongoose, { Schema, Document } from 'mongoose';

interface AmenityInterface extends Document {
    name: string;
}

const amenitySchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });

const Amenity = mongoose.model<AmenityInterface>('Amenity', amenitySchema);

export default Amenity;
