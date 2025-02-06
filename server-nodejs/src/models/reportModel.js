import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    report_type: {
        type: String,
        enum: ['Revenue', 'Room Availability', 'Feedback'],
        required: true
    },
    data: { 
        type: mongoose.Schema.Types.Mixed, //Flexible
        required: true 
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;