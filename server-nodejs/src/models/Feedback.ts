import mongoose, { Schema, Document, Types } from 'mongoose';

interface FeedbackInterface extends Document {
    user_id: Types.ObjectId;
    room_id?: Types.ObjectId;
    rating: number;
    comment?: string;
}

const feedbackSchema: Schema = new mongoose.Schema({
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
        type: Number, 
        min: 1, 
        max: 5, 
        required: true 
    },
    comment: { 
        type: String 
    }, 
}, { timestamps: true });

const Feedback = mongoose.model<FeedbackInterface>('Feedback', feedbackSchema);

export default Feedback;
