import mongoose, { Schema, Document, Types } from 'mongoose';

export enum PlannerType {
    TRAVEL_ITINERARY = 'travel_itinerary',
    DINING_PLAN = 'dining_plan',
    SPA_WELLNESS = 'spa_wellness',
    BUSINESS_TRIP = 'business_trip',
    ROMANTIC_GETAWAY = 'romantic_getaway',
    FAMILY_VACATION = 'family_vacation',
    ADVENTURE_TRIP = 'adventure_trip',
    CULTURAL_EXPERIENCE = 'cultural_experience'
}

export enum PlannerStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum ActivityType {
    DINING = 'dining',
    SPA = 'spa',
    EXCURSION = 'excursion',
    TRANSPORTATION = 'transportation',
    MEETING = 'meeting',
    LEISURE = 'leisure',
    SHOPPING = 'shopping',
    ENTERTAINMENT = 'entertainment'
}

interface PlanActivity {
    id: string;
    type: ActivityType;
    title: string;
    description?: string;
    location: string;
    startTime: Date;
    endTime: Date;
    duration: number; // in minutes
    cost?: number;
    bookingRequired: boolean;
    bookingId?: Types.ObjectId;
    confirmationStatus: 'pending' | 'confirmed' | 'cancelled';
    notes?: string;
    aiGenerated: boolean;
    priority: 'low' | 'medium' | 'high';
}

interface AIPreferences {
    budget: {
        total?: number;
        dining?: number;
        activities?: number;
        transportation?: number;
    };
    interests: string[];
    dietaryRestrictions?: string[];
    mobilityRequirements?: string[];
    groupSize: number;
    ageGroups: string[];
    preferredCuisines?: string[];
    activityLevel: 'low' | 'moderate' | 'high';
    travelStyle: 'luxury' | 'comfort' | 'budget' | 'adventure';
}

interface AITravelPlannerInterface extends Document {
    userId: Types.ObjectId;
    bookingId?: Types.ObjectId;
    plannerType: PlannerType;
    title: string;
    description?: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    status: PlannerStatus;
    activities: PlanActivity[];
    aiPreferences: AIPreferences;
    aiGeneratedContent: {
        suggestions: string[];
        recommendations: string[];
        tips: string[];
        warnings?: string[];
    };
    customizations: {
        userModifications: number;
        lastModifiedAt?: Date;
        modificationNotes?: string[];
    };
    sharing: {
        isPublic: boolean;
        sharedWith?: Types.ObjectId[];
        shareToken?: string;
    };
    feedback: {
        rating?: number;
        comment?: string;
        helpful?: boolean;
        suggestedImprovements?: string[];
    };
    totalEstimatedCost: number;
    actualCost?: number;
}

const planActivitySchema = new Schema({
    id: { type: String, required: true },
    type: { type: String, enum: Object.values(ActivityType), required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true, min: 0 },
    cost: { type: Number, min: 0 },
    bookingRequired: { type: Boolean, default: false },
    bookingId: { type: mongoose.Schema.Types.ObjectId },
    confirmationStatus: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled'], 
        default: 'pending' 
    },
    notes: { type: String },
    aiGenerated: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { _id: false });

const aiTravelPlannerSchema: Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    plannerType: {
        type: String,
        enum: Object.values(PlannerType),
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalDays: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: Object.values(PlannerStatus),
        default: PlannerStatus.DRAFT
    },
    activities: [planActivitySchema],
    aiPreferences: {
        budget: {
            total: { type: Number, min: 0 },
            dining: { type: Number, min: 0 },
            activities: { type: Number, min: 0 },
            transportation: { type: Number, min: 0 }
        },
        interests: [{ type: String, required: true }],
        dietaryRestrictions: [{ type: String }],
        mobilityRequirements: [{ type: String }],
        groupSize: { type: Number, required: true, min: 1 },
        ageGroups: [{ type: String }],
        preferredCuisines: [{ type: String }],
        activityLevel: { 
            type: String, 
            enum: ['low', 'moderate', 'high'], 
            default: 'moderate' 
        },
        travelStyle: { 
            type: String, 
            enum: ['luxury', 'comfort', 'budget', 'adventure'], 
            default: 'comfort' 
        }
    },
    aiGeneratedContent: {
        suggestions: [{ type: String }],
        recommendations: [{ type: String }],
        tips: [{ type: String }],
        warnings: [{ type: String }]
    },
    customizations: {
        userModifications: { type: Number, default: 0 },
        lastModifiedAt: { type: Date },
        modificationNotes: [{ type: String }]
    },
    sharing: {
        isPublic: { type: Boolean, default: false },
        sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        shareToken: { type: String }
    },
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        helpful: { type: Boolean },
        suggestedImprovements: [{ type: String }]
    },
    totalEstimatedCost: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    actualCost: {
        type: Number,
        min: 0
    }
}, { 
    timestamps: true 
});

aiTravelPlannerSchema.index({ userId: 1, status: 1 });
aiTravelPlannerSchema.index({ bookingId: 1 });
aiTravelPlannerSchema.index({ plannerType: 1, status: 1 });
aiTravelPlannerSchema.index({ startDate: 1, endDate: 1 });

const AITravelPlanner = mongoose.model<AITravelPlannerInterface>('AITravelPlanner', aiTravelPlannerSchema);

export default AITravelPlanner;