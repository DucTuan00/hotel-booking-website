import { Router } from 'express';
import * as restaurantController from '@/controllers/restaurants/restaurantController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from '@/types/user';

const router = Router();

router.get('/', restaurantController.getRestaurantInfo);
router.put('/', authMiddleware([UserRole.ADMIN]), restaurantController.updateRestaurantInfo);

export default router;