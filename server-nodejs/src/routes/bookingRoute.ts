import { Router } from 'express';
import authMiddleware from '@/middlewares/authMiddleware';
import * as bookingController from '@/controllers/bookings/bookingController';
import { UserRole } from "@/types/user";

const router = Router();

router.get('/preview-price', bookingController.previewBookingPrice);
router.post('/', authMiddleware([UserRole.USER, UserRole.ADMIN]), bookingController.createBooking);
router.get('/user', authMiddleware([UserRole.USER]), bookingController.getBookingsByUserId);
router.get('/:id', authMiddleware([UserRole.USER, UserRole.ADMIN]), bookingController.getBookingById);
router.get('/', authMiddleware([UserRole.ADMIN]), bookingController.getAllBookings);
router.post('/:id/cancel', authMiddleware([UserRole.USER, UserRole.ADMIN]), bookingController.cancelBooking);
router.patch('/:id/payment-status', authMiddleware([UserRole.ADMIN]), bookingController.updatePaymentStatus);
router.patch('/:id', authMiddleware([UserRole.ADMIN]), bookingController.updateBooking);

export default router;