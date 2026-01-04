import api from '@/services/api';
import { CreatePaymentUrlRequest, CreateMomoPaymentUrlResponse } from '@/types/payment';
import { isNativeMobile } from '@/utils/auth';

export const createMoMoPaymentUrl = async (
    data: CreatePaymentUrlRequest
): Promise<CreateMomoPaymentUrlResponse> => {
    const response = await api.post<CreateMomoPaymentUrlResponse>(
        '/momo/create-payment-url',
        {
            ...data,
            platform: isNativeMobile() ? 'mobile' : 'web', // Deep link only for native app
        }
    );
    return response.data;
};
