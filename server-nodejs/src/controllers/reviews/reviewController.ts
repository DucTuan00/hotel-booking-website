import { Request, Response } from 'express';
import * as reviewService from '@/services/reviews/reviewService';
import ApiError from '@/utils/apiError';

/**
 * POST /api/review
 * Create a new review
 */
export async function createReview(req: Request, res: Response) {
    try {
        const { bookingId, roomId, rating, comment } = req.body;
        const userId = (req as any).user.id;

        if (!bookingId || !roomId) {
            throw new ApiError('Booking ID and Room ID are required', 400);
        }

        const review = await reviewService.createReview({
            bookingId,
            userId,
            roomId,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            data: review,
            message: 'Review created successfully'
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to create review'
            });
        }
    }
}

/**
 * GET /api/review/room/:roomId
 * Get all reviews for a specific room
 */
export async function getReviewsByRoom(req: Request, res: Response) {
    try {
        const { roomId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const result = await reviewService.getReviewsByRoom({
            roomId,
            page,
            pageSize
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to get reviews'
            });
        }
    }
}

/**
 * GET /api/review/eligibility/:bookingId
 * Check if user can review a booking
 */
export async function checkReviewEligibility(req: Request, res: Response) {
    try {
        const { bookingId } = req.params;
        const userId = (req as any).user.id;

        const eligibility = await reviewService.checkReviewEligibility({
            userId,
            bookingId
        });

        res.status(200).json({
            success: true,
            data: eligibility
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to check review eligibility'
            });
        }
    }
}

/**
 * GET /api/review/eligible-bookings
 * Get all eligible bookings for review by logged-in user
 */
export async function getEligibleBookingsForReview(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;

        const bookings = await reviewService.getEligibleBookingsForReview(userId);

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to get eligible bookings'
            });
        }
    }
}

/**
 * GET /api/review/room/:roomId/rating
 * Get room rating statistics
 */
export async function getRoomRating(req: Request, res: Response) {
    try {
        const { roomId } = req.params;

        const rating = await reviewService.getRoomRating(roomId);

        res.status(200).json({
            success: true,
            data: rating
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to get room rating'
            });
        }
    }
}

/**
 * GET /api/review/admin
 * Get all reviews for admin
 */
export async function getAllReviews(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const search = req.query.search as string | undefined;
        const rating = req.query.rating ? parseInt(req.query.rating as string) : undefined;

        const result = await reviewService.getAllReviews({
            page,
            pageSize,
            search,
            rating
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to get reviews'
            });
        }
    }
}

/**
 * DELETE /api/review/admin/:reviewId
 * Delete review for admin
 */
export async function deleteReview(req: Request, res: Response) {
    try {
        const { reviewId } = req.params;

        await reviewService.deleteReview(reviewId);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to delete review'
            });
        }
    }
}
