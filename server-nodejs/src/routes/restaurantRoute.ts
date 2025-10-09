import { Router } from 'express';
import * as restaurantController from '@/controllers/restaurants/restaurantController';
import * as restaurantServiceController from '@/controllers/restaurants/restaurantServiceController';
import * as restaurantImageController from '@/controllers/restaurants/restaurantImageController';
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

// Restaurant images routes
router.get('/images', restaurantImageController.getAllRestaurantImages);
router.post('/images', authMiddleware([UserRole.ADMIN]), restaurantImageController.createRestaurantImage);
router.delete('/images/:id', authMiddleware([UserRole.ADMIN]), restaurantImageController.deleteRestaurantImage);

export default router;