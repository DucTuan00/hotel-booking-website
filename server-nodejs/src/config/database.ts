import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectionString: string | undefined = process.env.MONGODB_URI;

const connectDB = async (): Promise<void> => {
    try {
        if (!connectionString) {
            throw new Error('MONGODB_URI is not defined in the environment variables.');
        }
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        console.log('MongoDB Connected...');
    } catch (error: any) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
