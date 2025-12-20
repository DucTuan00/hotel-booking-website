export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export enum LoyaltyTier {
    BRONZE = 'Bronze',
    SILVER = 'Silver',
    GOLD = 'Gold',
    DIAMOND = 'Diamond',
}

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
        nextTierAt: -1,
    },
};

export interface LoyaltyInfo {
    tier: LoyaltyTier;
    totalBookings: number;
    totalSpent: number;
    currentDiscount: number;
    nextTierAt: number;
    bookingsToNextTier: number;
}

export type UserSortField = 'name' | 'email' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface CreateUserInput {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
}

export interface UserIdInput {
    id: string;
}

export interface UpdateUserInput {
    email?: string;
    name?: string;
    phone?: string;
    role?: string;
}

export interface UpdatePasswordInput {
    id?: string;
    oldPassword: string;
    newPassword: string;
}

export interface GetAllUsersInput {
    search?: string;
    role?: UserRole;
    sortBy?: UserSortField;
    sortOrder?: SortOrder;
    page?: number;
    pageSize?: number;
    excludeCurrentUser?: boolean;
}

export interface GetAllUsersResponse {
    users: User[];
    total?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    googleId?: string;
    notifications?: {
        type: string;
        message: string;
        read: boolean;
        created_at: string;
    }[];
    active: boolean;
}
