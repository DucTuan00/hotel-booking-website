import { Router } from 'express';
import * as favoriteController from '@/controllers/favorites/favoriteController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from "@/types/user";

const router = Router();

router.post('/', authMiddleware([UserRole.USER]), favoriteController.addFavorite);
router.get('/', authMiddleware([UserRole.USER]), favoriteController.getFavorites);
router.delete('/:roomId', authMiddleware([UserRole.USER]), favoriteController.deleteFavorite);

export default router;