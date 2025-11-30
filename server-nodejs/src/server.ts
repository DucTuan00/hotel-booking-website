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
import restaurantRoute from '@/routes/restaurantRoute';
import spaRoute from '@/routes/spaRoute';
import uploadRoute from '@/routes/uploadRoute';
import celebrateItemRoute from '@/routes/celebrateItemRoute';
import vnpayRoute from '@/routes/vnpayRoute';
import aiPlannerRoute from '@/routes/aiPlannerRoute';
import momoRoute from '@/routes/momoRoute';
import reviewRoute from '@/routes/reviewRoute';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import '@/config/passport.ts'; 

const app: express.Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

//Config to get current folder in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Connect MongoDB database
connectDB();

//Middleware
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://10.0.2.2:5173', // Android emulator (always for mobile dev)
    'http://localhost:5173', // Web dev
    'http://localhost', // Capacitor webview
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute);
app.use('/api/amenity', amenityRoute);
app.use('/api/booking', bookingRoute);
app.use('/api/restaurant', restaurantRoute);
app.use('/api/spa', spaRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/celebrate-item', celebrateItemRoute);
app.use('/api/vnpay', vnpayRoute);
app.use('/api/ai-planner', aiPlannerRoute);
app.use('/api/momo', momoRoute);
app.use('/api/review', reviewRoute);
app.use('/public/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use(errorHandler as ErrorRequestHandler);

app.listen(PORT, (): void => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
