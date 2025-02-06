import { Router } from 'express';
import favoriteController from '../controllers/favoriteController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware(['user']), favoriteController.addFavorite);
router.get('/', authMiddleware(['user']), favoriteController.getFavorites);
router.delete('/:roomId', authMiddleware(['user']), favoriteController.deleteFavorite);

export default router;