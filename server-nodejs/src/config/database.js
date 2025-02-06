import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const username = 'ductuan7';
const password = 'z6m8a!v2zuWc@es';
const database = 'hotel-booking';
const connectionString = `mongodb+srv://${username}:${password}@hotel-booking.7xqsp.mongodb.net/${database}?retryWrites=true&w=majority&appName=hotel-booking`;

const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;