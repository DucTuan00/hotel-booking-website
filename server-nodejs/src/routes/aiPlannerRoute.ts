import { Router } from 'express';
import authMiddleware, { optionalAuthMiddleware } from '@/middlewares/authMiddleware';
import * as aiPlannerController from '@/controllers/aiPlanner/aiPlannerController';
import { UserRole } from '@/types/user';

const router = Router();

// Public route — guests can generate a plan (result not saved to DB)
// Logged-in users get their plan saved and can view history/favorites
router.post('/generate', optionalAuthMiddleware(), aiPlannerController.generatePlan);

// Authenticated-only routes
router.get('/user', authMiddleware([UserRole.USER, UserRole.ADMIN]), aiPlannerController.getUserPlans);
router.get('/:id', authMiddleware([UserRole.USER, UserRole.ADMIN]), aiPlannerController.getPlan);
router.patch('/:id/favorite', authMiddleware([UserRole.USER, UserRole.ADMIN]), aiPlannerController.updateFavorite);

export default router;
