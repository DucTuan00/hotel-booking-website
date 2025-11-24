import mongoose, { Schema, Document, Types } from 'mongoose';
import { 
    GroupType, 
    BudgetLevel, 
    ActivityCategory 
} from '@/types/aiPlanner';

interface UserPreferences {
    travelDates?: {
        checkIn: Date;
        checkOut: Date;
    };
    groupType?: GroupType;
    groupSize?: number;
    budget?: BudgetLevel;
    interests?: string[];
    dietaryRestrictions?: string[];
    mobilityNeeds?: string[];
    priorities?: string[];
}

interface DailyActivity {
    time: string;
    title: string;
    location: string;
    duration: number;
    category: ActivityCategory;
    description: string;
    estimatedCost: number;
    bookingLink?: string;
}

interface DailyPlan {
    date: Date;
    dayNumber: number;
    activities: DailyActivity[];
}

interface GeneratedPlan {
    days: DailyPlan[];
    suggestions: string[];
    hanoiTips: string[];
    totalEstimatedCost: number;
}

interface AIGenerationMetadata {
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    temperature?: number;
    lastGeneratedAt?: Date;
}

interface AITravelPlannerInterface extends Document {
    userId: Types.ObjectId;
    preferences: UserPreferences;
    generatedPlan?: GeneratedPlan;
    aiGenerationMetadata: AIGenerationMetadata;
    status: 'active' | 'completed';
    isFavorite?: boolean;
}

const dailyActivitySchema = new Schema({
    time: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: Number, required: true, min: 0 },
    category: { 
        type: String, 
        enum: Object.values(ActivityCategory), 
        required: true 
    },
    description: { type: String, required: true },
    estimatedCost: { type: Number, required: true, min: 0, default: 0 },
    bookingLink: { type: String }
}, { _id: false });

const dailyPlanSchema = new Schema({
    date: { type: Date, required: true },
    dayNumber: { type: Number, required: true, min: 1 },
    activities: [dailyActivitySchema]
}, { _id: false });

const aiTravelPlannerSchema: Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    preferences: {
        travelDates: {
            checkIn: { type: Date },
            checkOut: { type: Date }
        },
        groupType: { 
            type: String, 
            enum: Object.values(GroupType) 
        },
        groupSize: { type: Number, min: 1 },
        budget: { 
            type: String, 
            enum: Object.values(BudgetLevel) 
        },
        interests: [{ type: String }],
        dietaryRestrictions: [{ type: String }],
        priorities: [{ type: String }]
    },
    generatedPlan: {
        days: [dailyPlanSchema],
        suggestions: [{ type: String }],
        hanoiTips: [{ type: String }],
        totalEstimatedCost: { type: Number, min: 0, default: 0 }
    },
    aiGenerationMetadata: {
        model: { 
            type: String, 
            required: true,
            default: 'gemini-2.5-flash'
        },
        promptTokens: { type: Number, min: 0 },
        completionTokens: { type: Number, min: 0 },
        temperature: { type: Number, min: 0, max: 2 },
        lastGeneratedAt: { type: Date }
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

aiTravelPlannerSchema.index({ userId: 1, status: 1 });
aiTravelPlannerSchema.index({ createdAt: -1 });

const AITravelPlanner = mongoose.model<AITravelPlannerInterface>('AITravelPlanner', aiTravelPlannerSchema);

export default AITravelPlanner;