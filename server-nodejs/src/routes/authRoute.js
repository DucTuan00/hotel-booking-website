import { Router } from 'express';
import authController from '../controllers/authController.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

export default router;