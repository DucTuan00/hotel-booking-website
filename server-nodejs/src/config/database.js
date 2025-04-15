import { mongoose } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;