import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectionString: string | undefined = process.env.MONGODB_URI;

export default async function connectDB(): Promise<void> {
    try {
        if (!connectionString) {
            throw new Error('MONGODB_URI is not defined in the environment variables.');
        }
        await mongoose.connect(connectionString);
        console.log('MongoDB Connected...');
    } catch (error: any) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};