import mongoose, { Schema, Document, Types } from 'mongoose';

interface FavoriteInterface extends Document {
    user: Types.ObjectId;
    room: Types.ObjectId;
}

const favoriteSchema: Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },
    },
    { timestamps: true }
);

// Make sure every user only have 1 favorite for every room
favoriteSchema.index({ user: 1, room: 1 }, { unique: true });

const Favorite = mongoose.model<FavoriteInterface>('Favorite', favoriteSchema);

export default Favorite;
