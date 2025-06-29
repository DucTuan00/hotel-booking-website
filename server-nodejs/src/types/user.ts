export interface InputCreateUser {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
}

export interface InputUpdateUser {
    id: string;
    email?: string;
    name?: string;
    phone?: string;
    role?: string;
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
    filter?: Record<string, any>;
    page?: number;
    pageSize?: number;
}