import { Router } from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware(['user', 'admin']), authController.logout);
router.post('/refresh-token', authMiddleware(['user', 'admin']), authController.refreshToken);
router.post('/verify-token', authController.verifyToken);

export default router;