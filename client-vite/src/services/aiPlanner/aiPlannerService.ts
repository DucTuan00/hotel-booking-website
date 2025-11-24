import api from '@/services/api';
import {
    TravelPlan,
    GeneratePlanInput,
    PlansListResponse,
} from '@/types/aiPlanner';

/**
 * Generate AI travel plan
 */
const generatePlan = async (
    input: GeneratePlanInput
): Promise<TravelPlan> => {
    const response = await api.post<TravelPlan>('/ai-planner/generate', input);
    return response.data;
};

/**
 * Get a specific plan by ID
 */
const getPlan = async (planId: string): Promise<TravelPlan> => {
    const response = await api.get<TravelPlan>(`/ai-planner/${planId}`);
    return response.data;
};

/**
 * Get user's plans
 */
const getUserPlans = async (params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'completed';
}): Promise<PlansListResponse> => {
    const response = await api.get<PlansListResponse>(
        '/ai-planner/user',
        { params }
    );
    return response.data;
};

/**
 * Toggle favorite status for a plan
 */
const updateFavorite = async (
    planId: string,
    isFavorite: boolean
): Promise<TravelPlan> => {
    const response = await api.patch<TravelPlan>(
        `/ai-planner/${planId}/favorite`,
        { isFavorite }
    );
    return response.data;
};

export default {
    generatePlan,
    getPlan,
    getUserPlans,
    updateFavorite,
};
