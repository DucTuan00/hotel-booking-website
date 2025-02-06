import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    room_id: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Room' 
    }, 
    rating: { 
        type: Number, min: 1, 
        max: 5, 
        required: true 
    },
    comment: { 
        type: String 
    }, 
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;