import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from "@/types/user";

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
    role: UserRole;
    notifications: Notification[];
    active: boolean;
    googleId?: string;
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
        required: false 
    },
    phone: { 
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, 
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
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;
