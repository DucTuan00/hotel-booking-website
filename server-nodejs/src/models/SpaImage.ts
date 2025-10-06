import mongoose, { Schema, Document, Types } from 'mongoose';

interface SpaImageInterface extends Document {
    spaId: Types.ObjectId;
    imagePath: string;
    title?: string;
    description?: string;
    deletedAt?: Date;
}

const spaImageSchema: Schema = new mongoose.Schema({
    spaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Spa',
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { 
    timestamps: true,
    collection: 'spa_images' 
});

const SpaImage = mongoose.model<SpaImageInterface>('SpaImage', spaImageSchema);

export default SpaImage;