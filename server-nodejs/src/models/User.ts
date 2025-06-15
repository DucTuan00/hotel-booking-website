import mongoose, { Schema, Document } from 'mongoose';

interface Notification {
    type: string;
    message: string;
    read: boolean;
    created_at: Date;
}

interface UserInterface extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'user' | 'admin';
    notifications: Notification[];
    refreshToken?: string;
    active: boolean;
}

const userSchema: Schema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String,
        required: true 
    },
    phone: { 
        type: String,
        required: true 
    },
    role: {
        type: String,
        enum: [
            'user',
            'admin',
        ],
        default: 'user'
    },
    notifications: [
        {
            type: { 
                type: String, 
                required: true 
            },
            message: { 
                type: String, 
                required: true 
            },
            read: { 
                type: Boolean, 
                default: false 
            },
            created_at: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
    refreshToken: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;
