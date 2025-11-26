import { Request, Response } from 'express';
import { createPayment, verifySignature } from '@/services/payment/momoService';
import Booking from '@/models/Booking';
import ApiError from '@/utils/apiError';
import { PaymentStatus, BookingStatus } from '@/types/booking';


/**
 * Create MoMo payment
 */
export async function createMomoPayment(req: Request, res: Response): Promise<void> {
    try {
        const { bookingId } = req.body;

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

        // Create payment with MoMo
        const result = await createPayment({
            amount: booking.totalPrice.toString(),
            orderInfo: `Thanh toan dat phong ${booking._id}`,
            extraData: JSON.stringify({ bookingId: String(booking._id), ipAddr })
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

        console.log('MoMo callback received:', callbackData);

        // Verify signature
        const isValid = verifySignature(callbackData);

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

        console.log('MoMo return:', queryData);

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

        // Redirect to frontend complete page
        res.redirect(`${frontendUrl}/booking/complete`);
    } catch (error) {
        console.error('MoMo return error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(
            `${frontendUrl}/booking/complete?success=false&message=${encodeURIComponent('Có lỗi xảy ra trong quá trình xử lý thanh toán')}`
        );
    }
};
