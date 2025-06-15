import { Router } from 'express';
import userController from '@/controllers/userController';
import authMiddleware from '@/middlewares/authMiddleware';

const router = Router();

router.get('/info', authMiddleware(['user', 'admin']), userController.getUserInfo);
router.get('/:id', authMiddleware(['user', 'admin']), userController.getUserById);
router.get('/', authMiddleware(['admin']), userController.getAllUsers);
router.post('/', authMiddleware(['admin']), userController.createUser);
router.put('/:id', authMiddleware(['admin']), userController.updateUserById);
router.put('/', authMiddleware(['user']), userController.updateUser);
router.put('/password/:id', authMiddleware(['user', 'admin']), userController.updatePassword);
router.delete('/:id', authMiddleware(['admin']), userController.deleteUser);

export default router;