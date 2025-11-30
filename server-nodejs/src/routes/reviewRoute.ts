import { Router } from 'express';
import authMiddleware from '@/middlewares/authMiddleware';
import * as reviewController from '@/controllers/reviews/reviewController';
import { UserRole } from "@/types/user";

const router = Router();

// Public routes
router.get('/room/:roomId', reviewController.getReviewsByRoom);
router.get('/room/:roomId/rating', reviewController.getRoomRating);

// Protected routes (authenticated users)
router.post('/', authMiddleware([UserRole.USER, UserRole.ADMIN]), reviewController.createReview);
router.get('/eligibility/:bookingId', authMiddleware([UserRole.USER, UserRole.ADMIN]), reviewController.checkReviewEligibility);
router.get('/eligible-bookings', authMiddleware([UserRole.USER, UserRole.ADMIN]), reviewController.getEligibleBookingsForReview);

export default router;
