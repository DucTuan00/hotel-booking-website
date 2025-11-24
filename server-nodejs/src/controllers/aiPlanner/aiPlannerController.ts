import { Request, Response, NextFunction } from 'express';
import * as aiPlannerService from '@/services/aiPlanner/aiPlannerService';
import ApiError from '@/utils/apiError';

/**
 * Generate AI travel plan
 */
export async function generatePlan(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        const { preferences } = req.body;

        if (!userId) {
            throw new ApiError('Không có quyền: thiếu user ID', 401);
        }

        if (!preferences) {
            throw new ApiError('Thiếu thông tin sở thích', 400);
        }

        const plan = await aiPlannerService.generatePlan({
            userId,
            preferences,
        });

        res.status(201).json(plan);
    } catch (error: any) {
        next(error);
    }
}

/**
 * Get a specific plan by ID
 */
export async function getPlan(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        const { id: planId } = req.params;

        if (!userId) {
            throw new ApiError('Không có quyền: thiếu user ID', 401);
        }

        const plan = await aiPlannerService.getPlanById(planId, userId);

        res.status(200).json(plan);
    } catch (error: any) {
        next(error);
    }
}

/**
 * Get user's plans
 */
export async function getUserPlans(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        const { page, limit, status } = req.query;

        if (!userId) {
            throw new ApiError('Không có quyền: thiếu user ID', 401);
        }

        const plans = await aiPlannerService.getUserPlans(userId, {
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            status: status as 'active' | 'completed' | undefined,
        });

        res.status(200).json(plans);
    } catch (error: any) {
        next(error);
    }
}

/**
 * Toggle favorite status for a plan
 */
export async function updateFavorite(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id;
        const { id: planId } = req.params;
        const { isFavorite } = req.body;

        if (!userId) {
            throw new ApiError('Không có quyền: thiếu user ID', 401);
        }

        const plan = await aiPlannerService.updateFavorite({
            planId,
            userId,
            isFavorite,
        });

        res.status(200).json(plan);
    } catch (error: any) {
        next(error);
    }
}
