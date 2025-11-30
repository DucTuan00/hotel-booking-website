import { VNPay, HashAlgorithm, ProductCode, VnpLocale, dateFormat, ignoreLogger } from 'vnpay';
import { vnpayConfig } from '@/config/vnpay';
import {
    CreatePaymentUrlParams,
    VNPayReturnQuery,
    VNPayVerifyResult,
    VNPayResponseCode,
    VNPayResponseMessage,
} from '@/types/vnpay';

// Initialize VNPay instance
const vnpay = new VNPay({
    tmnCode: vnpayConfig.tmnCode,
    secureSecret: vnpayConfig.secretKey,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: true,
    loggerFn: ignoreLogger,
});

/**
 * Get return URL based on platform
 * Mobile: Deep link directly to app (app will poll booking status)
 * Web: Backend URL to handle redirect
 */
function getReturnUrl(platform?: 'web' | 'mobile', bookingId?: string): string {
    if (platform === 'mobile') {
        // Mobile: Deep link with bookingId for polling
        const mobileReturnUrl = process.env.VNPAY_MOBILE_RETURN_URL || 'hotelboutique://payment-result';
        return `${mobileReturnUrl}?bookingId=${bookingId}&gateway=vnpay`;
    }
    // Web: Backend URL
    return vnpayConfig.returnUrl;
}

/**
 * Create payment URL for VNPay
 */
export function createPaymentUrl(params: CreatePaymentUrlParams): string {
    const {
        amount,
        bookingId,
        orderInfo,
        ipAddr,
        locale = 'vn',
        bankCode,
        platform,
    } = params;

    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: ipAddr,
        vnp_TxnRef: bookingId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: ProductCode.Hotel_Tourism,
        vnp_ReturnUrl: getReturnUrl(platform, bookingId),
        vnp_Locale: locale as VnpLocale,
        ...(bankCode && { vnp_BankCode: bankCode }),
    });

    return paymentUrl;
};

/**
 * Verify return URL from VNPay
 */
export function verifyReturnUrl(query: VNPayReturnQuery): VNPayVerifyResult {
    try {
        // Verify secure hash
        const verify = vnpay.verifyReturnUrl(query as any);

        if (!verify.isVerified) {
            return {
                isValid: false,
                isSuccess: false,
                message: 'Chữ ký không hợp lệ',
            };
        }

        // Check transaction status
        const responseCode = query.vnp_ResponseCode || '';
        const isSuccess = responseCode === VNPayResponseCode.SUCCESS;

        const message =
            VNPayResponseMessage[responseCode] || 'Giao dịch thất bại';

        // Parse payment data
        const amount = query.vnp_Amount ? parseInt(query.vnp_Amount) / 100 : 0;

        return {
            isValid: true,
            isSuccess,
            message,
            data: {
                amount,
                bankCode: query.vnp_BankCode || '',
                bankTranNo: query.vnp_BankTranNo || '',
                cardType: query.vnp_CardType || '',
                orderInfo: query.vnp_OrderInfo || '',
                payDate: query.vnp_PayDate || '',
                responseCode: query.vnp_ResponseCode || '',
                transactionNo: query.vnp_TransactionNo || '',
                transactionStatus: query.vnp_TransactionStatus || '',
                txnRef: query.vnp_TxnRef || '',
            },
        };
    } catch (error) {
        console.error('VNPay verify error:', error);
        return {
            isValid: false,
            isSuccess: false,
            message: 'Lỗi xác thực giao dịch',
        };
    }
};

/**
 * Query transaction from VNPay
 */
export async function queryTransaction(
    txnRef: string,
    transactionDate: number,
    orderInfo: string,
    transactionNo: number
): Promise<any> {
    try {
        const createDate = dateFormat(new Date());
        const requestId = `${txnRef}_query_${Date.now()}`;

        const result = await vnpay.queryDr({
            vnp_RequestId: requestId,
            vnp_TxnRef: txnRef,
            vnp_TransactionDate: transactionDate,
            vnp_CreateDate: createDate,
            vnp_OrderInfo: orderInfo,
            vnp_TransactionNo: transactionNo,
            vnp_IpAddr: '127.0.0.1',
        });

        return result;
    } catch (error) {
        console.error('VNPay query error:', error);
        throw error;
    }
};

/**
 * Refund transaction
 */
export async function refundTransaction(
    txnRef: string,
    amount: number,
    transactionDate: number,
    createBy: string,
    orderInfo: string
): Promise<any> {
    try {
        const vnpAmount = amount * 100;
        const createDate = dateFormat(new Date());
        const requestId = `${txnRef}_refund_${Date.now()}`;

        const result = await vnpay.refund({
            vnp_Amount: vnpAmount,
            vnp_TxnRef: txnRef,
            vnp_TransactionDate: transactionDate,
            vnp_CreateBy: createBy,
            vnp_CreateDate: createDate,
            vnp_IpAddr: '127.0.0.1',
            vnp_OrderInfo: orderInfo,
            vnp_RequestId: requestId,
            vnp_TransactionType: '02', // Full refund
        });

        return result;
    } catch (error) {
        console.error('VNPay refund error:', error);
        throw error;
    }
};

