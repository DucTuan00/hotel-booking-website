export interface RegisterInput {
    name: string;
    phone: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface MessageResponse {
    message: string;
    role?: string;
    accessToken?: string;
}