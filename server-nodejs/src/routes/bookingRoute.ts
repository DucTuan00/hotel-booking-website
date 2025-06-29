import { Router } from 'express';
import authMiddleware from '@/middlewares/authMiddleware';
import bookingController from '@/controllers/bookingController';

const router = Router();

router.post('/', authMiddleware(['user', 'admin']), bookingController.createBooking);
router.get('/user', authMiddleware(['user']), bookingController.getBookingsByUserId);
router.get('/:id', authMiddleware(['user', 'admin']), bookingController.getBookingById);
router.get('/', authMiddleware(['admin']), bookingController.getAllBookings);
router.delete('/:id', authMiddleware(['user', 'admin']), bookingController.cancelBooking);
router.patch('/:id', authMiddleware(['admin']), bookingController.updateBooking);

export default router;