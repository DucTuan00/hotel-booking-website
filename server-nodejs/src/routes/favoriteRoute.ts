import { Router } from 'express';
import favoriteController from '@/controllers/favoriteController';
import authMiddleware from '@/middlewares/authMiddleware';

const router = Router();

router.post('/', authMiddleware(['user']), favoriteController.addFavorite);
router.get('/', authMiddleware(['user']), favoriteController.getFavorites);
router.delete('/:roomId', authMiddleware(['user']), favoriteController.deleteFavorite);

export default router;