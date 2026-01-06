import { Router } from 'express';
import * as authController from '@/controllers/auth/authController';
import * as passwordResetController from '@/controllers/auth/passwordResetController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from "@/types/user";

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware([UserRole.USER, UserRole.ADMIN]), authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/verify-token', authController.verifyToken);

// Password reset routes
router.post('/forgot-password', passwordResetController.forgotPassword);
router.post('/verify-reset-code', passwordResetController.verifyResetCode);
router.post('/reset-password', passwordResetController.resetPassword);

// Google OAuth routes (Web - redirect flow)
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

// Google Sign-In for Mobile (Native - idToken verification)
router.post('/google/mobile', authController.googleMobileLogin);

export default router;