import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, LoyaltyTier } from "@/types/user";

interface UserInterface extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    active: boolean;
    googleId?: string;
    // Loyalty fields
    loyaltyTier: LoyaltyTier;
    loyaltyTotalBookings: number;
    loyaltyTotalSpent: number;
    loyaltyCurrentDiscount: number;
    loyaltyNextTierAt: number;
    loyaltyLastUpdateAt?: Date;
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
    active: {
        type: Boolean,
        default: true,
    },
    // Loyalty fields
    loyaltyTier: {
        type: String,
        enum: Object.values(LoyaltyTier),
        default: LoyaltyTier.BRONZE,
    },
    loyaltyTotalBookings: {
        type: Number,
        default: 0,
        min: 0,
    },
    loyaltyTotalSpent: {
        type: Number,
        default: 0,
        min: 0,
    },
    loyaltyCurrentDiscount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    loyaltyNextTierAt: {
        type: Number,
        default: 3,
    },
    loyaltyLastUpdateAt: {
        type: Date,
    },
}, { timestamps: true });

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;
