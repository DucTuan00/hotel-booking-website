export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export type UserSortField = 'name' | 'email' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

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
}