import express from 'express';
import * as momoController from '@/controllers/payment/momoController';
import authMiddleware from '@/middlewares/authMiddleware';

const router = express.Router();

// Create MoMo payment (protected - requires login)
router.post('/create-payment-url', authMiddleware([]), momoController.createMomoPayment);

// Handle MoMo IPN callback (public - MoMo sends notification here)
router.post('/callback', momoController.handleMomoCallback);

// Handle MoMo return URL (public - MoMo redirects here)
router.get('/return', momoController.handleMomoReturn);

export default router;
