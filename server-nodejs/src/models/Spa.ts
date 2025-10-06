import mongoose, { Schema, Document, Types } from 'mongoose';

interface SpaInterface extends Document {
    information: string;
}

const spaSchema: Schema = new mongoose.Schema({
    information: {
        type: String,
        required: true,
    },
}, { 
    timestamps: true,
    collection: 'spas' 
});

const Spa = mongoose.model<SpaInterface>('Spa', spaSchema);

export default Spa;