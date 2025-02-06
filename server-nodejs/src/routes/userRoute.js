import { Router } from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/:id', authMiddleware(['user']), userController.getUserById);
router.get('/', authMiddleware(['admin']), userController.getAllUsers);
router.put('/:id', authMiddleware(['user', 'admin']), userController.updateUser);
router.put('/password/:id', authMiddleware(['user', 'admin']), userController.updatePassword);
router.delete('/:id', authMiddleware(['admin']), userController.deleteUser);

export default router;