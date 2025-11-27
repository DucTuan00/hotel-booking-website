// MARK: Input
export interface MomoPaymentRequest {
    amount: string;
    orderInfo: string;
    extraData?: string;
}

// MARK: Response
export interface MomoPaymentResponse {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: string;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl?: string;
    deeplink?: string;
    qrCodeUrl?: string;
}