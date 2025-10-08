import { Router } from 'express';
import * as restaurantController from '@/controllers/restaurants/restaurantController';
import * as restaurantServiceController from '@/controllers/restaurants/restaurantServiceController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from '@/types/user';

const router = Router();

// Restaurant info routes
router.get('/', restaurantController.getRestaurantInfo);
router.put('/', authMiddleware([UserRole.ADMIN]), restaurantController.updateRestaurantInfo);

// Restaurant services routes
router.get('/services', restaurantServiceController.getAllRestaurantServices);
router.get('/services/:id', restaurantServiceController.getRestaurantServiceById);
router.post('/services', authMiddleware([UserRole.ADMIN]), restaurantServiceController.createRestaurantService);
router.put('/services/:id', authMiddleware([UserRole.ADMIN]), restaurantServiceController.updateRestaurantService);
router.delete('/services/:id', authMiddleware([UserRole.ADMIN]), restaurantServiceController.deleteRestaurantService);

export default router;