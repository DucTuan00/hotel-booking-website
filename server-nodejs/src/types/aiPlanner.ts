export enum GroupType {
    SOLO = 'solo',
    COUPLE = 'couple',
    FAMILY = 'family',
    FRIENDS = 'friends'
}

export enum BudgetLevel {
    ECONOMY = 'economy',
    STANDARD = 'standard',
    LUXURY = 'luxury'
}

export enum ActivityCategory {
    HOTEL = 'hotel',
    DINING = 'dining',
    SPA = 'spa',
    SIGHTSEEING = 'sightseeing',
    SHOPPING = 'shopping',
    CULTURE = 'culture',
    NIGHTLIFE = 'nightlife',
    RELAXATION = 'relaxation'
}

export interface GeneratePlanInput {
    userId: string;
    preferences: UserPreferencesResponse;
}

export interface UserPreferencesResponse {
    travelDates?: {
        checkIn: string; 
        checkOut: string;
    };
    groupType?: GroupType;
    groupSize?: number;
    budget?: BudgetLevel;
    interests?: string[];
    dietaryRestrictions?: string[];
    priorities?: string[];
}

export interface DailyActivityResponse {
    time: string;
    title: string;
    location: string;
    duration: number;
    category: ActivityCategory;
    description: string;
    estimatedCost: number;
    bookingLink?: string;
}

export interface DailyPlanResponse {
    date: Date;
    dayNumber: number;
    activities: DailyActivityResponse[];
}

export interface GeneratedPlanResponse {
    days: DailyPlanResponse[];
    suggestions: string[];
    hanoiTips: string[];
    totalEstimatedCost: number;
}

export interface PlanResponse {
    id: string;
    userId: string;
    preferences: UserPreferencesResponse;
    generatedPlan?: GeneratedPlanResponse;
    status: 'active' | 'completed';
    isFavorite?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface GetPlansQuery {
    page?: number;
    limit?: number;
    status?: 'active' | 'completed';
}

export interface PlansListResponse {
    plans: PlanResponse[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}


