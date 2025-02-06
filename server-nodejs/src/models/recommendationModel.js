import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
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

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;