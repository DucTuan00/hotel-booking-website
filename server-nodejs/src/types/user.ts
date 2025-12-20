// MARK: Enums
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export enum LoyaltyTier {
    BRONZE = 'Bronze',      // 0% discount
    SILVER = 'Silver',      // 5% discount
    GOLD = 'Gold',          // 10% discount
    DIAMOND = 'Diamond',    // 15% discount
}

// Loyalty tier configuration
export const LOYALTY_CONFIG = {
    [LoyaltyTier.BRONZE]: {
        minBookings: 0,
        discount: 0,
        nextTierAt: 3,
    },
    [LoyaltyTier.SILVER]: {
        minBookings: 3,
        discount: 5,
        nextTierAt: 6,
    },
    [LoyaltyTier.GOLD]: {
        minBookings: 6,
        discount: 10,
        nextTierAt: 10,
    },
    [LoyaltyTier.DIAMOND]: {
        minBookings: 10,
        discount: 15,
        nextTierAt: -1, // Max tier
    },
};

// MARK: Types
export type UserSortField = 'name' | 'email' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

// MARK: Input
export interface InputCreateUser {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: UserRole;
}

export interface InputUpdateUser {
    id: string;
    email?: string;
    name?: string;
    phone?: string;
    role?: UserRole;
}

export interface InputUpdatePassword {
    id: string;
    oldPassword: string;
    newPassword: string;
}

export interface UserIdInput {
    id: string;
}

export interface GetAllUsersInput {
    search?: string;
    role?: UserRole;
    sortBy?: UserSortField;
    sortOrder?: SortOrder;
    page?: number;
    pageSize?: number;
    excludeCurrentUser?: boolean;
    currentUserId?: string;
}