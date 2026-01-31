import { Router } from 'express';
import * as userController from '@/controllers/users/userController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from "@/types/user";

const router = Router();

router.get('/info', authMiddleware([UserRole.USER, UserRole.ADMIN]), userController.getUserInfo);
router.get('/loyalty', authMiddleware([UserRole.USER, UserRole.ADMIN]), userController.getLoyaltyInfo);
router.put('/password', authMiddleware([UserRole.USER, UserRole.ADMIN]), userController.updatePassword);
router.get('/', authMiddleware([UserRole.ADMIN]), userController.getAllUsers);
router.post('/', authMiddleware([UserRole.ADMIN]), userController.createUser);
router.put('/', authMiddleware([UserRole.USER, UserRole.ADMIN]), userController.updateUser);
router.get('/:id', authMiddleware([UserRole.USER, UserRole.ADMIN]), userController.getUserById);
router.put('/:id', authMiddleware([UserRole.ADMIN]), userController.updateUserById);
router.patch('/:id/toggle-active', authMiddleware([UserRole.ADMIN]), userController.toggleUserActive);
router.delete('/:id', authMiddleware([UserRole.ADMIN]), userController.deleteUser);

export default router;