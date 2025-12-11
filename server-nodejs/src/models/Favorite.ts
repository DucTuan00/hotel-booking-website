import mongoose, { Schema, Document, Types } from 'mongoose';

interface FavoriteInterface extends Document {
    userId: Types.ObjectId;
    roomId: Types.ObjectId;
}

const favoriteSchema: Schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },
    },
    { timestamps: true }
);

// Make sure every user only have 1 favorite for every room
favoriteSchema.index({ userId: 1, roomId: 1 }, { unique: true });

const Favorite = mongoose.model<FavoriteInterface>('Favorite', favoriteSchema);

export default Favorite;
