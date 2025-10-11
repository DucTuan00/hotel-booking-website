import mongoose, { Schema, Document, Types } from 'mongoose';

interface SpaServiceInterface extends Document {
    spaId: Types.ObjectId;
    imagePath: string;
    title: string;
    description?: string;
    price?: number;
    deletedAt?: Date;
}

const spaServiceSchema: Schema = new mongoose.Schema({
    spaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Spa',
        required: true
    },
    imagePath: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { 
    timestamps: true,
    collection: 'spa_services' 
});

const SpaService = mongoose.model<SpaServiceInterface>('SpaService', spaServiceSchema);

export default SpaService;