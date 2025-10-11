import { Router } from 'express';
import * as spaController from '@/controllers/spa/spaController';
import * as spaServiceController from '@/controllers/spa/spaServiceController';
import * as spaImageController from '@/controllers/spa/spaImageController';
import authMiddleware from '@/middlewares/authMiddleware';
import { UserRole } from '@/types/user';

const router = Router();

// Spa info routes
router.get('/', spaController.getSpaInfo);
router.put('/', authMiddleware([UserRole.ADMIN]), spaController.updateSpaInfo);

// Spa services routes
router.get('/services', spaServiceController.getAllSpaServices);
router.get('/services/:id', spaServiceController.getSpaServiceById);
router.post('/services', authMiddleware([UserRole.ADMIN]), spaServiceController.createSpaService);
router.put('/services/:id', authMiddleware([UserRole.ADMIN]), spaServiceController.updateSpaService);
router.delete('/services/:id', authMiddleware([UserRole.ADMIN]), spaServiceController.deleteSpaService);

// Spa images routes
router.get('/images', spaImageController.getAllSpaImages);
router.post('/images', authMiddleware([UserRole.ADMIN]), spaImageController.createSpaImage);
router.delete('/images/:id', authMiddleware([UserRole.ADMIN]), spaImageController.deleteSpaImage);

export default router;