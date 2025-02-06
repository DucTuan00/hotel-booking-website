import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
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
    is_available: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;