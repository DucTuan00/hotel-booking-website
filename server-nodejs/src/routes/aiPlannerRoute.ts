import { Router } from 'express';
import authMiddleware from '@/middlewares/authMiddleware';
import * as aiPlannerController from '@/controllers/aiPlanner/aiPlannerController';
import { UserRole } from '@/types/user';

const router = Router();

// User routes
router.post('/generate', authMiddleware([UserRole.USER, UserRole.ADMIN]), aiPlannerController.generatePlan);
router.get('/user', authMiddleware([UserRole.USER, UserRole.ADMIN]), aiPlannerController.getUserPlans);
router.get('/:id', authMiddleware([UserRole.USER, UserRole.ADMIN]), aiPlannerController.getPlan);
router.patch('/:id/favorite', authMiddleware([UserRole.USER, UserRole.ADMIN]), aiPlannerController.updateFavorite);

export default router;
