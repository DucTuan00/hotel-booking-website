import { Router } from 'express';
import * as userController from '@/controllers/users/userController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from "@/types/user";

const router = Router();

router.get('/info', authMiddleware([UserRole.USER, UserRole.ADMIN]), userController.getUserInfo);
router.get('/:id', authMiddleware([UserRole.USER, UserRole.ADMIN]), userController.getUserById);
router.get('/', authMiddleware([UserRole.ADMIN]), userController.getAllUsers);
router.post('/', authMiddleware([UserRole.ADMIN]), userController.createUser);
router.put('/:id', authMiddleware([UserRole.ADMIN]), userController.updateUserById);
router.put('/', authMiddleware([UserRole.USER]), userController.updateUser);
router.put('/password/:id', authMiddleware([UserRole.USER, UserRole.ADMIN]), userController.updatePassword);
router.delete('/:id', authMiddleware([UserRole.ADMIN]), userController.deleteUser);

export default router;