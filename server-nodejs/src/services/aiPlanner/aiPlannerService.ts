import AITravelPlanner from '@/models/AIPlanner';
import { geminiModel } from '@/config/gemini';
import ApiError from '@/utils/apiError';
import {
    GeneratePlanInput,
    PlanResponse,
    GetPlansQuery,
    PlansListResponse,
} from '@/types/aiPlanner';
import {
    buildSystemPrompt,
    buildItineraryPrompt,
} from '@/services/aiPlanner/prompts';

/**
 * Map Vietnamese category names to English enum values
 */
function mapCategoryToEnglish(category: string): string {
    const categoryMap: Record<string, string> = {
        'khách sạn': 'hotel',
        'ẩm thực': 'dining',
        'spa': 'spa',
        'tham quan': 'sightseeing',
        'mua sắm': 'shopping',
        'văn hóa': 'culture',
        'giải trí': 'nightlife',
        'thư giãn': 'relaxation',
    };
    
    const lowerCategory = category.toLowerCase().trim();
    return categoryMap[lowerCategory] || category;
}

/**
 * Generate AI travel plan based on user preferences
 */
export async function generatePlan(
    input: GeneratePlanInput
): Promise<PlanResponse> {
    try {
        const { userId, preferences } = input;

        // Create plan document
        const plan = await AITravelPlanner.create({
            userId,
            preferences,
            aiGenerationMetadata: {
                model: 'gemini-2.5-flash',
            },
            status: 'active',
        });

        // Generate itinerary using Gemini
        const systemPrompt = buildSystemPrompt();
        const itineraryPrompt = buildItineraryPrompt(preferences);
        const fullPrompt = `${systemPrompt}\n\n${itineraryPrompt}`;

        const result = await geminiModel.generateContent(fullPrompt);
        const response = result.response;
        let text = response.text();

        // Clean up markdown if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const planData = JSON.parse(text);

        // Build allowed categories based on user's selected interests
        const allowedCategories = new Set<string>(['dining', 'hotel']); // Always allow dining and hotel
        if (preferences.interests) {
            preferences.interests.forEach(interest => {
                const interestLower = interest.toLowerCase().trim();
                if (interestLower === 'ẩm thực') allowedCategories.add('dining');
                else if (interestLower === 'tham quan') allowedCategories.add('sightseeing');
                else if (interestLower === 'mua sắm') allowedCategories.add('shopping');
                else if (interestLower === 'giải trí') allowedCategories.add('nightlife');
                else if (interestLower === 'thư giãn') allowedCategories.add('relaxation');
            });
        }

        // Map categories, filter invalid activities, and calculate total cost
        let totalCost = 0;
        if (planData.days) {
            planData.days.forEach((day: any) => {
                // Filter activities to only include allowed categories
                day.activities = day.activities.filter((activity: any) => {
                    // Map category to English
                    if (activity.category) {
                        activity.category = mapCategoryToEnglish(activity.category);
                    }
                    
                    // Check if category is allowed
                    const isAllowed = allowedCategories.has(activity.category);
                    
                    // Calculate cost only for allowed activities
                    if (isAllowed && activity.estimatedCost) {
                        totalCost += activity.estimatedCost;
                    }
                    
                    return isAllowed;
                });
            });
        }

        // Add dates to days (parse YYYY-MM-DD string to preserve local date)
        if (preferences.travelDates) {
            // Parse YYYY-MM-DD without timezone conversion
            const [year, month, dayOfMonth] = preferences.travelDates.checkIn.split('-').map(Number);
            const checkInDate = new Date(year, month - 1, dayOfMonth); // month is 0-indexed
            
            planData.days = planData.days.map((dayPlan: any, index: number) => {
                const dayDate = new Date(year, month - 1, dayOfMonth + index);
                return {
                    ...dayPlan,
                    date: dayDate,
                };
            });
        }

        // Save generated plan
        plan.generatedPlan = {
            days: planData.days || [],
            suggestions: planData.suggestions || [],
            hanoiTips: planData.hanoiTips || [],
            totalEstimatedCost: totalCost,
        };

        plan.status = 'completed';

        // Update AI metadata
        if (response.usageMetadata) {
            plan.aiGenerationMetadata.promptTokens = response.usageMetadata.promptTokenCount || 0;
            plan.aiGenerationMetadata.completionTokens = response.usageMetadata.candidatesTokenCount || 0;
        }
        plan.aiGenerationMetadata.lastGeneratedAt = new Date();

        await plan.save();

        return mapPlanToResponse(plan);
    } catch (error: any) {
        console.error('Error generating plan:', error);
        throw new ApiError(error.message || 'Failed to generate plan', 500);
    }
}

/**
 * Get plan by ID
 */
export async function getPlanById(
    planId: string,
    userId: string
): Promise<PlanResponse> {
    try {
        const plan = await AITravelPlanner.findOne({
            _id: planId,
            userId,
        });

        if (!plan) {
            throw new ApiError('Kế hoạch không tìm thấy', 404);
        }

        return mapPlanToResponse(plan);
    } catch (error: any) {
        throw new ApiError(error.message || 'Không thể tải kế hoạch', 500);
    }
}

/**
 * Get user's plans with pagination
 */
export async function getUserPlans(
    userId: string,
    query: GetPlansQuery
): Promise<PlansListResponse> {
    try {
        const { page = 1, limit = 10, status } = query;
        const skip = (page - 1) * limit;

        const filter: any = { userId };
        if (status) {
            filter.status = status;
        }

        const [plans, total] = await Promise.all([
            AITravelPlanner.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AITravelPlanner.countDocuments(filter),
        ]);

        return {
            plans: plans.map(mapPlanToResponse),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error: any) {
        throw new ApiError(error.message || 'Không thể tải danh sách kế hoạch', 500);
    }
}

/**
 * Update favorite status
 */
export async function updateFavorite(input: {
    planId: string;
    userId: string;
    isFavorite: boolean;
}): Promise<PlanResponse> {
    try {
        const { planId, userId, isFavorite } = input;

        const plan = await AITravelPlanner.findOne({
            _id: planId,
            userId,
        });

        if (!plan) {
            throw new ApiError('Kế hoạch không tìm thấy', 404);
        }

        plan.isFavorite = isFavorite;
        await plan.save();

        return mapPlanToResponse(plan);
    } catch (error: any) {
        throw new ApiError(error.message || 'Không thể cập nhật yêu thích', 500);
    }
}

/**
 * Helper: Map plan document to response
 */
function mapPlanToResponse(plan: any): PlanResponse {
    return {
        id: plan._id?.toString() || plan.id,
        userId: plan.userId?.toString() || plan.userId,
        preferences: plan.preferences,
        generatedPlan: plan.generatedPlan,
        status: plan.status,
        isFavorite: plan.isFavorite,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
    };
}