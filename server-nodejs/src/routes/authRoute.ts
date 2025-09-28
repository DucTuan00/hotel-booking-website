import { Router } from 'express';
import * as authController from '@/controllers/auth/authController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from "@/types/user";

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware([UserRole.USER, UserRole.ADMIN]), authController.logout);
router.post('/refresh-token', authMiddleware([UserRole.USER, UserRole.ADMIN]), authController.refreshToken);
router.post('/verify-token', authController.verifyToken);

export default router;