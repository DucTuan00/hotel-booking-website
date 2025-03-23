import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import roomRoute from './routes/roomRoute.js';
import amenityRoute from './routes/amenityRoute.js';
import bookingRoute from './routes/bookingRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

//Config to get current folder in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Connect MongoDB database
connectDB();

//Middleware
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3001', // Address ReactJS
    credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute);
app.use('/api/amenity', amenityRoute);
app.use('/api/booking', bookingRoute);
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});