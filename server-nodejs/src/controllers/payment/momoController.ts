import { Request, Response, NextFunction } from 'express';
import { createPayment, verifySignature } from '@/services/payment/momoService';
import Booking from '@/models/Booking';
import ApiError from '@/utils/apiError';
import { PaymentStatus, BookingStatus } from '@/types/booking';


/**
 * Create MoMo payment
 */
export async function createMomoPayment(req: Request, res: Response): Promise<void> {
    try {
        const { bookingId, platform } = req.body;

        // Validate bookingId
        if (!bookingId) {
            throw new ApiError('Booking ID is required', 400);
        }

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

        // Create payment with MoMo
        const result = await createPayment({
            amount: booking.totalPrice.toString(),
            orderInfo: `Thanh toan dat phong ${booking._id}`,
            extraData: JSON.stringify({ bookingId: String(booking._id), ipAddr }),
            platform,
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('MoMo payment error:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create MoMo payment'
        });
    }
};

/**
 * Handle MoMo IPN (Instant Payment Notification) callback
 */
export async function handleMomoCallback(req: Request, res: Response): Promise<void> {
    try {
        const callbackData = req.body;

        console.log('MoMo IPN/Callback received:', callbackData);

        // Verify signature
        const isValid = verifySignature(callbackData);
        console.log('MoMo IPN Signature Valid:', isValid);

        if (!isValid) {
            res.status(200).json({
                resultCode: 97,
                message: 'Invalid signature'
            });
            return;
        }

        const { resultCode, orderId, transId, extraData, amount } = callbackData;

        // Extract bookingId from extraData or orderId
        let bookingId = '';
        try {
            if (extraData) {
                const parsed = JSON.parse(extraData);
                bookingId = parsed.bookingId;
            }
        } catch (e) {
            // If extraData parsing fails, try to extract from orderId
            console.log('Could not parse extraData, will search by orderId');
        }

        // Find booking
        let booking;
        if (bookingId) {
            booking = await Booking.findById(bookingId);
        } else {
            // Fallback: search by orderId in payment details
            booking = await Booking.findOne({ 'paymentDetails.orderId': orderId });
        }

        if (!booking) {
            res.status(200).json({
                resultCode: 1,
                message: 'Booking not found'
            });
            return;
        }

        // Check if already updated
        if (booking.paymentStatus === PaymentStatus.PAID) {
            res.status(200).json({
                resultCode: 2,
                message: 'Order already confirmed'
            });
            return;
        }

        // Update payment status based on resultCode
        if (resultCode === 0) {
            // Payment successful
            booking.paymentStatus = PaymentStatus.PAID;
            booking.paidAt = new Date();
            booking.status = BookingStatus.CONFIRMED;
            booking.confirmedAt = new Date();
        }

        // Store payment details regardless of success/failure
        booking.paymentDetails = {
            gateway: 'momo',
            transactionId: transId,
            responseCode: resultCode.toString(),
            payDate: callbackData.responseTime,
            rawData: callbackData,
        };

        await booking.save();

        console.log(`MoMo payment processed - BookingId: ${booking._id}, ResultCode: ${resultCode}`);

        // Return success to MoMo
        res.status(200).json({
            resultCode: 0,
            message: 'Success'
        });
    } catch (error) {
        console.error('MoMo callback error:', error);
        res.status(200).json({
            resultCode: 99,
            message: 'Unknown error'
        });
    }
};

/**
 * Handle MoMo redirect return URL
 */
export async function handleMomoReturn(req: Request, res: Response): Promise<void> {
    try {
        const queryData = req.query;

        // Verify signature
        const isValid = verifySignature(queryData);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        if (!isValid) {
            // Invalid signature - redirect to frontend with error
            res.redirect(
                `${frontendUrl}/booking/complete?success=false&message=${encodeURIComponent('Chữ ký không hợp lệ')}`
            );
            return;
        }

        const { resultCode, orderId, transId, extraData, message } = queryData as any;

        // Extract bookingId from extraData
        let bookingId = '';
        try {
            if (extraData) {
                const parsed = JSON.parse(extraData as string);
                bookingId = parsed.bookingId;
            }
        } catch (e) {
            console.log('Could not parse extraData in return URL');
        }

        // Find booking
        let booking;
        if (bookingId) {
            booking = await Booking.findById(bookingId);
        } else {
            booking = await Booking.findOne({ 'paymentDetails.orderId': orderId });
        }

        if (!booking) {
            res.redirect(
                `${frontendUrl}/booking/complete?success=false&message=${encodeURIComponent('Không tìm thấy đơn đặt phòng')}`
            );
            return;
        }

        // Update payment status if success
        if (resultCode === '0') {
            booking.paymentStatus = PaymentStatus.PAID;
            booking.paidAt = new Date();
            booking.status = BookingStatus.CONFIRMED;
            booking.confirmedAt = new Date();
        }

        // Store/update payment details
        booking.paymentDetails = {
            gateway: 'momo',
            transactionId: transId as string,
            responseCode: resultCode as string,
            payDate: queryData.responseTime as string,
            rawData: queryData,
        };

        await booking.save();

        // Check if payment is successful
        const isSuccess = resultCode === '0';
        const statusMessage = isSuccess ? 'Thanh toán thành công' : (message || 'Thanh toán thất bại');

        // Detect if this is mobile return by checking paymentDetails.platform
        const isMobileReturn = booking.paymentDetails?.platform === 'mobile';

        if (isMobileReturn) {
            // Redirect to mobile deep link with ALL momo params for signature verification
            const mobileReturnUrl = process.env.MOMO_MOBILE_RETURN_URL || 'hotelboutique://payment-result';
            
            // Build query string with all momo params + gateway identifier
            const deepLinkParams = new URLSearchParams();
            deepLinkParams.append('gateway', 'momo');
            deepLinkParams.append('bookingId', String(booking._id));
            
            // Add all MoMo params from the original callback
            Object.keys(queryData).forEach(key => {
                deepLinkParams.append(key, String((queryData as any)[key]));
            });
            
            const redirectUrl = `${mobileReturnUrl}?${deepLinkParams.toString()}`;
            
            res.redirect(redirectUrl);
        } else {
            // Redirect to web frontend
            res.redirect(`${frontendUrl}/booking/complete`);
        }
    } catch (error) {
        console.error('MoMo return error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(
            `${frontendUrl}/booking/complete?success=false&message=${encodeURIComponent('Có lỗi xảy ra trong quá trình xử lý thanh toán')}`
        );
    }
};

/**
 * Verify and update booking from mobile deep link
 * Mobile app sends MoMo result params from deep link
 * Backend verifies signature and updates booking
 */
export async function verifyAndUpdateFromMobile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { bookingId: reqBookingId, gateway, ...allParams } = req.body;

        // Filter out non-MoMo parameters
        const momoParams: Record<string, any> = {};
        Object.keys(allParams).forEach(key => {
            // Keep all MoMo parameters (not starting with vnp_ or our custom fields)
            if (!key.startsWith('vnp_') && key !== 'bookingId' && key !== 'gateway') {
                momoParams[key] = allParams[key];
            }
        });

        // Verify signature
        const isValid = verifySignature(momoParams);
        
        if (!isValid) {
            throw new ApiError('Invalid signature', 400);
        }

        const { resultCode, orderId, transId, extraData, message } = momoParams;

        // Extract bookingId from extraData or request body
        let bookingId = reqBookingId; // From request body (our custom field)
        if (!bookingId && extraData) {
            try {
                const parsed = JSON.parse(extraData);
                bookingId = parsed.bookingId;
            } catch (e) {
                console.error('Could not parse extraData');
            }
        }

        if (!bookingId) {
            throw new ApiError('Booking ID not found', 400);
        }

        // Find booking
        const booking = await Booking.findById(bookingId);
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
        if (resultCode === 0 || resultCode === '0') {
            booking.paymentStatus = PaymentStatus.PAID;
            booking.paidAt = new Date();
            booking.status = BookingStatus.CONFIRMED;
            booking.confirmedAt = new Date();
        }

        // Store payment details
        booking.paymentDetails = {
            gateway: 'momo',
            transactionId: transId,
            responseCode: String(resultCode),
            payDate: momoParams.responseTime,
            platform: 'mobile',
            rawData: momoParams,
        };

        await booking.save();

        res.json({
            success: true,
            message: resultCode === 0 || resultCode === '0' ? 'Payment successful' : (message || 'Payment failed'),
            data: booking,
        });
    } catch (error) {
        console.error('MoMo mobile verify error:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Payment verification error',
        });
    }
};
