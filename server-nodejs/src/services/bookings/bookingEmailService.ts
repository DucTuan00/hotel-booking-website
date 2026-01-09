import { resend, EMAIL_FROM, emailTemplates } from '@/config/email';
import ApiError from '@/utils/apiError';

interface BookingEmailData {
    bookingId: string;
    customerName: string;
    customerEmail: string;
    roomName: string;
    roomType: string;
    checkIn: Date;
    checkOut: Date;
    nights: number;
    quantity: number;
    guests: {
        adults: number;
        children?: number;
    };
    totalPrice: number;
    paymentMethod: string;
    celebrateItems?: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    discount?: {
        tier: string;
        percent: number;
        amount: number;
    };
}

/**
 * Send booking confirmation email to customer using Resend
 */
export async function sendBookingConfirmationEmail(bookingData: BookingEmailData) {
    try {
        // Format dates for display
        const formatDate = (date: Date) => {
            return new Date(date).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        };

        const emailData = {
            bookingId: bookingData.bookingId,
            customerName: bookingData.customerName,
            roomName: bookingData.roomName,
            roomType: bookingData.roomType,
            checkIn: formatDate(bookingData.checkIn),
            checkOut: formatDate(bookingData.checkOut),
            nights: bookingData.nights,
            quantity: bookingData.quantity,
            guests: bookingData.guests,
            totalPrice: bookingData.totalPrice,
            paymentMethod: bookingData.paymentMethod,
            celebrateItems: bookingData.celebrateItems,
            discount: bookingData.discount,
        };

        const emailTemplate = emailTemplates.bookingConfirmation(emailData);

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: `Lion Hotel Boutique <${EMAIL_FROM}>`,
            to: [bookingData.customerEmail],
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        });

        if (error) {
            console.error('Error sending booking confirmation email:', error);
            return {
                success: false,
                error: error.message,
            };
        }

        console.log('Booking confirmation email sent:', data?.id);
        
        return {
            success: true,
            messageId: data?.id,
        };
    } catch (error: any) {
        console.error('Error sending booking confirmation email:', error);
        // Don't throw error - we don't want email failure to block booking creation
        // Just log it and return failure status
        return {
            success: false,
            error: error.message,
        };
    }
}
