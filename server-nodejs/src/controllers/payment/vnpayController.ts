import { Request, Response, NextFunction } from 'express';
import * as vnpayService from '@/services/payment/vnpayService';
import Booking from '@/models/Booking';
import ApiError from '@/utils/apiError';
import { PaymentStatus, BookingStatus } from '@/types/booking';
import { dateFormat } from 'vnpay';

/**
 * Create VNPay payment URL
 */
export async function createPaymentUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { bookingId, bankCode, locale, platform } = req.body;

        // Get booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new ApiError('Booking not found', 404);
        }

        // Check if booking is already paid
        if (booking.paymentStatus === PaymentStatus.PAID) {
            throw new ApiError('Booking is already paid', 400);
        }

        // Get client IP
        const ipAddr =
            (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
            req.socket.remoteAddress ||
            '127.0.0.1';

        // Store platform info for later use in return handler
        booking.paymentDetails = booking.paymentDetails || {};
        booking.paymentDetails.platform = platform || 'web';
        await booking.save();

        // Create payment URL
        const paymentUrl = vnpayService.createPaymentUrl({
            amount: booking.totalPrice,
            bookingId: String(booking._id),
            orderInfo: `Thanh toan dat phong ${booking._id}`,
            ipAddr,
            locale,
            bankCode,
            platform,
        });

        res.json({
            success: true,
            data: {
                paymentUrl,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * VNPay return URL handler
 */
export async function vnpayReturn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const query = req.query as any;

        // Verify return URL
        const verifyResult = vnpayService.verifyReturnUrl(query);

        if (!verifyResult.isValid) {
            // Invalid signature - redirect to frontend with error
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(
                `${frontendUrl}/booking/complete?success=false&message=${encodeURIComponent(verifyResult.message)}`
            );
            return;
        }

        if (!verifyResult.data) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(
                `${frontendUrl}/booking/complete?success=false&message=${encodeURIComponent('Dữ liệu thanh toán không hợp lệ')}`
            );
            return;
        }

        const { txnRef, transactionNo, amount, responseCode } = verifyResult.data;

        // Update booking
        const booking = await Booking.findById(txnRef);
        if (!booking) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(
                `${frontendUrl}/booking/complete?success=false&message=${encodeURIComponent('Không tìm thấy đơn đặt phòng')}`
            );
            return;
        }

        // Update payment status and store payment details
        // If payment success: PAID, if failed: keep UNPAID
        if (verifyResult.isSuccess) {
            booking.paymentStatus = PaymentStatus.PAID;
            booking.paidAt = new Date();
            booking.status = BookingStatus.CONFIRMED;
            booking.confirmedAt = new Date();
        }
        // Store payment details regardless of success/failure
        booking.paymentDetails = {
            gateway: 'vnpay',
            transactionId: transactionNo,
            responseCode: responseCode,
            bankCode: verifyResult.data.bankCode,
            cardType: verifyResult.data.cardType,
            payDate: verifyResult.data.payDate,
            rawData: verifyResult.data,
        };

        await booking.save();

        // Detect if this is mobile return by checking paymentDetails.platform
        const isMobileReturn = booking.paymentDetails?.platform === 'mobile';

        if (isMobileReturn) {
            // Redirect to mobile deep link with ALL vnpay params for signature verification
            const mobileReturnUrl = process.env.VNPAY_MOBILE_RETURN_URL || 'hotelboutique://payment-result';
            
            // Build query string with all vnp_* params + gateway identifier
            const deepLinkParams = new URLSearchParams();
            deepLinkParams.append('gateway', 'vnpay');
            deepLinkParams.append('bookingId', txnRef);
            
            // Add all vnp_* params from the original callback
            Object.keys(query).forEach(key => {
                if (key.startsWith('vnp_')) {
                    deepLinkParams.append(key, query[key]);
                }
            });
            
            const redirectUrl = `${mobileReturnUrl}?${deepLinkParams.toString()}`;
            
            res.redirect(redirectUrl);
        } else {
            // Redirect to web frontend
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${frontendUrl}/booking/complete`);
        }
    } catch (error) {
        console.error('VNPay return error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(
            `${frontendUrl}/booking/complete?success=false&message=${encodeURIComponent('Có lỗi xảy ra trong quá trình xử lý thanh toán')}`
        );
    }
};

/**
 * VNPay IPN (Instant Payment Notification) handler
 */
export async function vnpayIPN(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const query = req.query as any;

        // Verify IPN
        const verifyResult = vnpayService.verifyReturnUrl(query);

        if (!verifyResult.isValid) {
            res.json({
                RspCode: '97',
                Message: 'Invalid signature',
            });
            return;
        }

        if (!verifyResult.data) {
            res.json({
                RspCode: '99',
                Message: 'Invalid data',
            });
            return;
        }

        const { txnRef, transactionNo, responseCode } = verifyResult.data;

        // Update booking
        const booking = await Booking.findById(txnRef);
        if (!booking) {
            res.json({
                RspCode: '01',
                Message: 'Booking not found',
            });
            return;
        }

        // Check if already updated
        if (booking.paymentStatus === PaymentStatus.PAID) {
            res.json({
                RspCode: '02',
                Message: 'Order already confirmed',
            });
            return;
        }

        // Update payment status and store payment details
        // If payment success: PAID, if failed: keep UNPAID
        if (verifyResult.isSuccess) {
            booking.paymentStatus = PaymentStatus.PAID;
            booking.paidAt = new Date();
            booking.status = BookingStatus.CONFIRMED;
            booking.confirmedAt = new Date();
        }
        // Store payment details regardless of success/failure
        booking.paymentDetails = {
            gateway: 'vnpay',
            transactionId: transactionNo,
            responseCode: responseCode,
            bankCode: verifyResult.data.bankCode,
            cardType: verifyResult.data.cardType,
            payDate: verifyResult.data.payDate,
            rawData: verifyResult.data,
        };

        await booking.save();

        // Return success
        res.json({
            RspCode: '00',
            Message: 'Success',
        });
    } catch (error) {
        console.error('VNPay IPN error:', error);
        res.json({
            RspCode: '99',
            Message: 'Unknown error',
        });
    }
}

/**
 * Verify and update booking from mobile deep link
 * Mobile app sends all VNPay params from deep link
 * Backend verifies signature and updates booking
 */
export async function verifyAndUpdateFromMobile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { bookingId, gateway, ...allParams } = req.body;

        // Filter only vnp_* parameters for signature verification
        const vnpayParams: Record<string, any> = {};
        Object.keys(allParams).forEach(key => {
            if (key.startsWith('vnp_')) {
                vnpayParams[key] = allParams[key];
            }
        });

        // Verify signature
        const verifyResult = vnpayService.verifyReturnUrl(vnpayParams);
        
        if (!verifyResult.isValid) {
            throw new ApiError('Invalid signature', 400);
        }

        if (!verifyResult.data) {
            throw new ApiError('Invalid payment data', 400);
        }

        const { txnRef, transactionNo, responseCode } = verifyResult.data;

        // Get booking
        const booking = await Booking.findById(txnRef);
        if (!booking) {
            throw new ApiError('Booking not found', 404);
        }

        // Check if already updated
        if (booking.paymentStatus === PaymentStatus.PAID) {
            res.json({
                success: true,
                message: 'Order already paid',
                data: booking,
            });
            return;
        }

        // Update payment status
        if (verifyResult.isSuccess) {
            booking.paymentStatus = PaymentStatus.PAID;
            booking.paidAt = new Date();
            booking.status = BookingStatus.CONFIRMED;
            booking.confirmedAt = new Date();
        }

        // Store payment details
        booking.paymentDetails = {
            gateway: 'vnpay',
            transactionId: transactionNo,
            responseCode: responseCode,
            bankCode: verifyResult.data.bankCode,
            cardType: verifyResult.data.cardType,
            payDate: verifyResult.data.payDate,
            platform: 'mobile',
            rawData: verifyResult.data,
        };

        await booking.save();

        res.json({
            success: true,
            message: verifyResult.message,
            data: booking,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Query transaction status
 */
export async function queryTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new ApiError('Booking not found', 404);
        }

        if (!booking.paymentDetails?.transactionId) {
            throw new ApiError('No VNPay transaction found for this booking', 400);
        }

        // Query transaction from VNPay
        const transactionDate = booking.paymentDetails.payDate
            ? parseInt(booking.paymentDetails.payDate)
            : dateFormat(booking.createdAt || new Date());

        const result = await vnpayService.queryTransaction(
            String(booking._id),
            transactionDate,
            `Thanh toan dat phong ${booking._id}`,
            parseInt(booking.paymentDetails.transactionId)
        );

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
