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

export interface UserPreferences {
    travelDates?: {
        checkIn: string; // Format: YYYY-MM-DD
        checkOut: string; // Format: YYYY-MM-DD
    };
    groupType?: GroupType;
    groupSize?: number;
    budget?: BudgetLevel;
    interests?: string[];
    dietaryRestrictions?: string[];
    priorities?: string[];
}

export interface DailyActivity {
    time: string;
    title: string;
    location: string;
    duration: number;
    category: ActivityCategory;
    description: string;
    estimatedCost: number;
    bookingLink?: string;
}

export interface DailyPlan {
    date: Date;
    dayNumber: number;
    activities: DailyActivity[];
}

export interface GeneratedPlan {
    days: DailyPlan[];
    suggestions: string[];
    hanoiTips: string[];
    totalEstimatedCost: number;
}

export interface TravelPlan {
    id: string;
    userId: string;
    preferences: UserPreferences;
    generatedPlan?: GeneratedPlan;
    status: 'active' | 'completed';
    isFavorite?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface GeneratePlanInput {
    preferences: UserPreferences;
}

export interface PlansListResponse {
    plans: TravelPlan[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
