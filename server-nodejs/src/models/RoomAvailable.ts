import mongoose, { Schema, Document, Types } from 'mongoose';

interface RoomAvailableInterface extends Document {
    roomId: Types.ObjectId;
    date: Date;
    price: number;
    inventory: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const roomAvailableSchema: Schema = new mongoose.Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    inventory: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true,
    collection: 'room_availables'
});

roomAvailableSchema.index({ roomId: 1, date: 1 }, { unique: true });

const RoomAvailable = mongoose.model<RoomAvailableInterface>('RoomAvailable', roomAvailableSchema);

export default RoomAvailable;