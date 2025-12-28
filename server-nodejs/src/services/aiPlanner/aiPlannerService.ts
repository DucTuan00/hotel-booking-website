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
 * Remove markdown bold formatting from text
 */
function removeBoldFormatting(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

/**
 * Clean text fields in plan data to remove markdown formatting
 */
function cleanPlanTextFields(planData: any): any {
    if (planData.days) {
        planData.days.forEach((day: any) => {
            if (day.activities) {
                day.activities.forEach((activity: any) => {
                    if (activity.title) activity.title = removeBoldFormatting(activity.title);
                    if (activity.description) activity.description = removeBoldFormatting(activity.description);
                    if (activity.location) activity.location = removeBoldFormatting(activity.location);
                });
            }
        });
    }
    if (planData.suggestions) {
        planData.suggestions = planData.suggestions.map((s: string) => removeBoldFormatting(s));
    }
    if (planData.hanoiTips) {
        planData.hanoiTips = planData.hanoiTips.map((t: string) => removeBoldFormatting(t));
    }
    return planData;
}

/**
 * Attempt to fix and parse potentially malformed JSON from AI response
 */
function parseAIResponse(text: string): any {
    // Clean up markdown code blocks if present
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try direct parse first
    try {
        const parsed = JSON.parse(cleaned);
        return cleanPlanTextFields(parsed);
    } catch (e) {
        // If failed, try to fix common issues
    }
    
    // Try to fix trailing commas (common AI mistake)
    cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    
    // Try to fix unquoted property names
    cleaned = cleaned.replace(/(\{|\,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
    
    // Try to fix single quotes to double quotes
    cleaned = cleaned.replace(/'/g, '"');
    
    try {
        const parsed = JSON.parse(cleaned);
        return cleanPlanTextFields(parsed);
    } catch (e) {
        // If still failed, try to extract valid JSON object
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                return cleanPlanTextFields(parsed);
            } catch (innerError) {
                throw new Error('AI response is not valid JSON. Please try again.');
            }
        }
        throw new Error('AI response is not valid JSON. Please try again.');
    }
}

/**
 * Generate AI travel plan based on user preferences
 */
export async function generatePlan(
    input: GeneratePlanInput
): Promise<PlanResponse> {
    const { userId, preferences } = input;
    
    // Variables to track AI response for metadata
    let aiResponse: any = null;
    let planData: any = null;

    try {
        // Step 1: Generate itinerary using Gemini FIRST (before creating DB record)
        const systemPrompt = buildSystemPrompt();
        const itineraryPrompt = buildItineraryPrompt(preferences);
        const fullPrompt = `${systemPrompt}\n\n${itineraryPrompt}`;

        const result = await geminiModel.generateContent(fullPrompt);
        aiResponse = result.response;
        const text = aiResponse.text();

        // Step 2: Parse and validate AI response
        planData = parseAIResponse(text);
        
        // Validate required structure
        if (!planData.days || !Array.isArray(planData.days)) {
            throw new Error('AI response missing required "days" array. Please try again.');
        }

        // Build allowed categories based on user's selected interests ONLY
        const allowedCategories = new Set<string>();
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
            
            planData.days = planData.days.map((dayPlan: any, index: number) => {
                const dayDate = new Date(year, month - 1, dayOfMonth + index);
                return {
                    ...dayPlan,
                    date: dayDate,
                };
            });
        }

        // Step 3: Only create DB record AFTER successful AI generation and parsing
        const plan = await AITravelPlanner.create({
            userId,
            preferences,
            aiGenerationMetadata: {
                model: 'gemini-2.5-flash',
                promptTokens: aiResponse.usageMetadata?.promptTokenCount || 0,
                completionTokens: aiResponse.usageMetadata?.candidatesTokenCount || 0,
                lastGeneratedAt: new Date(),
            },
            status: 'completed',
            generatedPlan: {
                days: planData.days || [],
                suggestions: planData.suggestions || [],
                hanoiTips: planData.hanoiTips || [],
                totalEstimatedCost: totalCost,
            },
        });

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
            throw new ApiError('Plan not found', 404);
        }

        return mapPlanToResponse(plan);
    } catch (error: any) {
        throw new ApiError(error.message || 'Failed to load plan', 500);
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
        throw new ApiError(error.message || 'Failed to load plans list', 500);
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
            throw new ApiError('Plan not found', 404);
        }

        plan.isFavorite = isFavorite;
        await plan.save();

        return mapPlanToResponse(plan);
    } catch (error: any) {
        throw new ApiError(error.message || 'Failed to update favorite status', 500);
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