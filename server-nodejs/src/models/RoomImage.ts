import mongoose, { Schema, Document, Types } from 'mongoose';

interface RoomImageInterface extends Document {
    roomId: Types.ObjectId;
    imagePath: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

const roomImageSchema: Schema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { 
    timestamps: true,
    collection: 'room_images' 
});

roomImageSchema.index({ roomId: 1, deletedAt: 1 });

const RoomImage = mongoose.model<RoomImageInterface>('RoomImage', roomImageSchema);

export default RoomImage;