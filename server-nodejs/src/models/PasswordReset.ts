import mongoose, { Document, Schema } from 'mongoose';

export interface IPasswordReset extends Document {
    email: string;
    code: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        used: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: 'password_resets',
    }
);

// Index for automatic deletion of expired documents
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster email lookups
passwordResetSchema.index({ email: 1, used: 1 });

const PasswordReset = mongoose.model<IPasswordReset>('PasswordReset', passwordResetSchema);

export default PasswordReset;
