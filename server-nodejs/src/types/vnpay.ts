export enum PaymentMethod {
  CASH = 'CASH',
  VNPAY = 'VNPAY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface VNPayConfig {
  tmnCode: string;
  secretKey: string;
  vnpayUrl: string;
  apiUrl: string;
  returnUrl: string;
}

export interface CreatePaymentUrlParams {
  amount: number;
  bookingId: string;
  orderInfo: string;
  ipAddr: string;
  locale?: string;
  bankCode?: string;
}

export interface VNPayReturnQuery {
  vnp_Amount?: string;
  vnp_BankCode?: string;
  vnp_BankTranNo?: string;
  vnp_CardType?: string;
  vnp_OrderInfo?: string;
  vnp_PayDate?: string;
  vnp_ResponseCode?: string;
  vnp_TmnCode?: string;
  vnp_TransactionNo?: string;
  vnp_TransactionStatus?: string;
  vnp_TxnRef?: string;
  vnp_SecureHash?: string;
  [key: string]: string | undefined;
}

export interface VNPayVerifyResult {
  isValid: boolean;
  isSuccess: boolean;
  message: string;
  data?: {
    amount: number;
    bankCode: string;
    bankTranNo: string;
    cardType: string;
    orderInfo: string;
    payDate: string;
    responseCode: string;
    transactionNo: string;
    transactionStatus: string;
    txnRef: string;
  };
}

export interface VNPayQueryResult {
  vnp_ResponseCode: string;
  vnp_Message: string;
  vnp_TxnResponseCode: string;
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
}

// VNPay Response Codes
export const VNPayResponseCode = {
  SUCCESS: '00',
  TRANSACTION_NOT_FOUND: '01',
  INVALID_CARD: '02',
  CARD_EXPIRED: '03',
  INSUFFICIENT_BALANCE: '04',
  INVALID_OTP: '05',
  TRANSACTION_FAILED: '07',
  SUSPECTED_FRAUD: '09',
  USER_CANCELLED: '24',
  TIMEOUT: '51',
  INVALID_AMOUNT: '65',
  DAILY_LIMIT_EXCEEDED: '75',
  BANK_MAINTENANCE: '79',
  INVALID_PASSWORD: '99',
} as const;

export const VNPayResponseMessage: Record<string, string> = {
  '00': 'Giao dịch thành công',
  '01': 'Giao dịch không tồn tại',
  '02': 'Thẻ không hợp lệ',
  '03': 'Thẻ đã hết hạn',
  '04': 'Số dư không đủ',
  '05': 'OTP không chính xác',
  '07': 'Giao dịch thất bại',
  '09': 'Giao dịch nghi ngờ gian lận',
  '24': 'Người dùng hủy giao dịch',
  '51': 'Giao dịch hết hạn',
  '65': 'Số tiền không hợp lệ',
  '75': 'Vượt quá hạn mức giao dịch trong ngày',
  '79': 'Ngân hàng đang bảo trì',
  '99': 'Mật khẩu không chính xác',
};
