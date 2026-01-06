import api from '../api';

interface ForgotPasswordRequest {
    email: string;
}

interface VerifyResetCodeRequest {
    email: string;
    code: string;
}

interface ResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
}

export const sendPasswordResetCode = async (
    data: ForgotPasswordRequest
): Promise<void> => {
    await api.post('/auth/forgot-password', data);
};

export const verifyResetCode = async (
    data: VerifyResetCodeRequest
): Promise<void> => {
    await api.post('/auth/verify-reset-code', data);
};

export const resetPassword = async (
    data: ResetPasswordRequest
): Promise<void> => {
    await api.post('/auth/reset-password', data);
};
