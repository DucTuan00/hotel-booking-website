export interface RegisterInput {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: string;
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