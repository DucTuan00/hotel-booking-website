import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import bookingController from '../controllers/bookingController.js';

const router = Router();

router.post('/', authMiddleware(['user']), bookingController.createBooking);
router.get('/user', authMiddleware(['user']), bookingController.getBookingsByUserId);
router.get('/:id', authMiddleware(['user', 'admin']), bookingController.getBookingById);
router.get('/', authMiddleware(['admin']), bookingController.getAllBookings);
router.delete('/:id', authMiddleware(['user', 'admin']), bookingController.cancelBooking);

export default router;