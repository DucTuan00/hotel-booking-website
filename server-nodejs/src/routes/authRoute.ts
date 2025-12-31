import { Router } from 'express';
import * as authController from '@/controllers/auth/authController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from "@/types/user";

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware([UserRole.USER, UserRole.ADMIN]), authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/verify-token', authController.verifyToken);

// Google OAuth routes (Web - redirect flow)
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

// Google Sign-In for Mobile (Native - idToken verification)
router.post('/google/mobile', authController.googleMobileLogin);

export default router;