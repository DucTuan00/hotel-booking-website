import mongoose, { Schema, Document, Types } from 'mongoose';

interface RoomAmenityInterface extends Document {
    roomId: Types.ObjectId;
    amenityId: Types.ObjectId;
}

const roomAmenitySchema: Schema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    amenityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Amenity',
        required: true
    }
}, { 
    timestamps: true,
    collection: 'room_amenities' 
});

roomAmenitySchema.index({ roomId: 1, amenityId: 1 }, { unique: true });

const RoomAmenity = mongoose.model<RoomAmenityInterface>('RoomAmenity', roomAmenitySchema);

export default RoomAmenity;
