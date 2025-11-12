import { VNPayConfig } from '@/types/vnpay';

/**
 * Get default Return URL for VNPay based on environment
 * Only used as fallback if VNPAY_RETURN_URL is not set
 */
const getDefaultReturnUrl = (): string => {
    // For development, default to localhost
    const port = process.env.PORT || 3000;
    return `http://localhost:${port}/api/vnpay/return`;
};

export const vnpayConfig: VNPayConfig = {
    tmnCode: process.env.VNPAY_TMN_CODE || '',
    secretKey: process.env.VNPAY_SECRET_KEY || '',
    vnpayUrl: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    apiUrl: process.env.VNPAY_API_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
    // Always prefer explicit env variable
    // Production MUST set VNPAY_RETURN_URL explicitly
    returnUrl: process.env.VNPAY_RETURN_URL || getDefaultReturnUrl(),
};

// Validate VNPay configuration
export const validateVNPayConfig = (): boolean => {
    if (!vnpayConfig.tmnCode || !vnpayConfig.secretKey) {
        console.error('VNPay configuration is missing. Please set VNPAY_TMN_CODE and VNPAY_SECRET_KEY in .env file');
        return false;
    }
    return true;
};
