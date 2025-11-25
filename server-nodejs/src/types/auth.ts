import { UserRole } from "@/types/user";

// MARK: Input
export interface RegisterInput {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: UserRole;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface UserIdInput {
    userId: string; 
}

export interface AccessTokenInput {
    accessToken: string;
}