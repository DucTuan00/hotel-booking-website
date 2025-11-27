import api from '@/services/api';
import { CreatePaymentUrlRequest, CreateVNPayPaymentUrlResponse } from '@/types/payment';
import { isMobile } from '@/utils/auth';

/**
 * Create VNPay payment URL
 */
export const createVNPayPaymentUrl = async (
    data: CreatePaymentUrlRequest
): Promise<CreateVNPayPaymentUrlResponse> => {
    const response = await api.post<CreateVNPayPaymentUrlResponse>(
        '/vnpay/create-payment-url',
        {
            ...data,
            platform: isMobile() ? 'mobile' : 'web', // Auto-detect platform
        }
    );
    return response.data;
};

/**
 * Query transaction status
 */
export const queryTransaction = async (bookingId: string): Promise<any> => {
    const response = await api.get(`/vnpay/query/${bookingId}`);
    return response.data;
};
