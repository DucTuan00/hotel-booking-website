import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import roomRoute from './routes/roomRoute.js';
import amenityRoute from './routes/amenityRoute.js';
import bookingRoute from './routes/bookingRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

//Connect MongoDB database
connectDB();

//Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/room', roomRoute);
app.use('/api/amenity', amenityRoute);
app.use('/api/booking', bookingRoute);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});