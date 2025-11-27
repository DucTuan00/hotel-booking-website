export interface CreatePaymentUrlRequest {
    bookingId: string;
    bankCode?: string;
    locale?: string;
}

// Response VNPay
export interface CreateVNPayPaymentUrlResponse {
    success: boolean;
    data: {
        paymentUrl: string;
    };
}

// Response Momo
export interface CreateMomoPaymentUrlResponse {
    success: boolean;
    data: {
        payUrl: string;
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
