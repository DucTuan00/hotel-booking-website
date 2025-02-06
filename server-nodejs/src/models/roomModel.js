import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, 
    room_type: {
        type: String,
        enum: ['Single', 'Double', 'Suite'],
        required: true
    },
    description: { 
        type: String 
    }, 
    amenities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Amenity',
    }], 
    price: { 
        type: Number, 
        required: true 
    }, 
    images: [String],
    max_guests: { 
        type: Number, 
        required: true 
    }, 
    // availability: {
    //     start_date: {
    //         type: Date,
    //         required: true
    //     },
    //     end_date: {
    //         type: Date,
    //         required: true
    //     },
    //     is_available: {
    //         type: Boolean,
    //         default: true
    //     }
    // },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

export default Room;