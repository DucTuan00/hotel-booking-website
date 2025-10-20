import mongoose, { Schema, Document } from 'mongoose';

interface CelebrateItemInterface extends Document {
    name: string;
    description?: string;
    price: number;
    imagePath?: string;
}

const celebrateItemSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    imagePath: {
        type: String
    }
}, { 
    timestamps: true,
    collection: 'celebrate_items' 
});

const CelebrateItem = mongoose.model<CelebrateItemInterface>('CelebrateItem', celebrateItemSchema);

export default CelebrateItem;