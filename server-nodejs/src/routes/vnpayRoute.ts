import express from 'express';
import * as vnpayController from '@/controllers/payment/vnpayController';
import authMiddleware from '@/middlewares/authMiddleware';

const router = express.Router();

// Create payment URL (protected - requires login)
router.post('/create-payment-url', authMiddleware([]), vnpayController.createPaymentUrl);

// VNPay return URL (public - VNPay redirects here)
router.get('/return', vnpayController.vnpayReturn);

// VNPay IPN (public - VNPay sends notification here)
router.get('/ipn', vnpayController.vnpayIPN);

// Query transaction status (protected - admin or owner)
router.get('/query/:bookingId', authMiddleware([]), vnpayController.queryTransaction);

export default router;
