import express from 'express';
import * as vnpayController from '@/controllers/payment/vnpayController';
import authMiddleware, { optionalAuthMiddleware } from '@/middlewares/authMiddleware';

const router = express.Router();

// Create payment URL — guests can pay too (booking already exists at this point)
router.post('/create-payment-url', optionalAuthMiddleware(), vnpayController.createPaymentUrl);

// VNPay return URL (public - VNPay redirects here)
router.get('/return', vnpayController.vnpayReturn);

// VNPay IPN (public - VNPay sends notification here)
router.get('/ipn', vnpayController.vnpayIPN);

// Verify and update booking from mobile deep link (protected - requires login)
router.post('/verify-and-update', authMiddleware([]), vnpayController.verifyAndUpdateFromMobile);

// Query transaction status (protected - admin or owner)
router.get('/query/:bookingId', authMiddleware([]), vnpayController.queryTransaction);

export default router;
