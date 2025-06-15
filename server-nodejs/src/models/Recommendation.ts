import mongoose, { Schema, Document, Types } from 'mongoose';

interface RecommendationInterface extends Document {
    user_id: Types.ObjectId;
    recommended_rooms: Types.ObjectId[];
    recommended_services: Types.ObjectId[];
}

const recommendationSchema: Schema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    recommended_rooms: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Room' 
        }
    ], 
    recommended_services: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Service' 
        }
    ]
}, { timestamps: true });

const Recommendation = mongoose.model<RecommendationInterface>('Recommendation', recommendationSchema);

export default Recommendation;
