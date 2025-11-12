export interface CreatePaymentUrlRequest {
    bookingId: string;
    bankCode?: string;
    locale?: string;
}

export interface CreatePaymentUrlResponse {
    success: boolean;
    data: {
        paymentUrl: string;
    };
}

export interface PaymentDetails {
    gateway?: 'vnpay' | 'momo' | 'zalopay';
    transactionId?: string;
    responseCode?: string;
    bankCode?: string;
    cardType?: string;
    payDate?: string;
    rawData?: Record<string, any>;
}
