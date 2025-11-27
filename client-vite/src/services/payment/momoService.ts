import api from '@/services/api';
import { CreatePaymentUrlRequest, CreateMomoPaymentUrlResponse } from '@/types/payment';
import { isMobile } from '@/utils/auth';

export const createMoMoPaymentUrl = async (
    data: CreatePaymentUrlRequest
): Promise<CreateMomoPaymentUrlResponse> => {
    const response = await api.post<CreateMomoPaymentUrlResponse>(
        '/momo/create-payment-url',
        {
            ...data,
            platform: isMobile() ? 'mobile' : 'web',
        }
    );
    return response.data;
};
