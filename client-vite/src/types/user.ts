export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
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
