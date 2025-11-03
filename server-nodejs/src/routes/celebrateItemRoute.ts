import { Router } from 'express';
import * as celebrateItemController from '@/controllers/celebrations/celebrateItemController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from '@/types/user';

const router = Router();

// Celebrate item routes
router.get('/', celebrateItemController.getAllCelebrateItems);
router.get('/:id', celebrateItemController.getCelebrateItemById);
router.post('/', authMiddleware([UserRole.ADMIN]), celebrateItemController.createCelebrateItem);
router.put('/:id', authMiddleware([UserRole.ADMIN]), celebrateItemController.updateCelebrateItem);
router.delete('/:id', authMiddleware([UserRole.ADMIN]), celebrateItemController.deleteCelebrateItem);

export default router;
