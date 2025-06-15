import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from '@/config/database';
import errorHandler from '@/middlewares/errorHandler';
import { ErrorRequestHandler } from 'express';
import authRoute from '@/routes/authRoute';
import userRoute from '@/routes/userRoute';
import roomRoute from '@/routes/roomRoute';
import amenityRoute from '@/routes/amenityRoute';
import bookingRoute from '@/routes/bookingRoute';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app: express.Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

//Config to get current folder in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Connect MongoDB database
connectDB();

//Middleware
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Address ReactJS - Vite
    credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute);
app.use('/api/amenity', amenityRoute);
app.use('/api/booking', bookingRoute);
app.use('/public/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use(errorHandler as ErrorRequestHandler);

app.listen(PORT, (): void => {
    console.log(`Server running on port ${PORT}`);
});
