import { transporter, emailTemplates } from '@/config/email';
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
 * Send booking confirmation email to customer
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

        const mailOptions = {
            from: `"Lion Hotel Boutique" <${process.env.EMAIL_USER}>`,
            to: bookingData.customerEmail,
            subject: emailTemplate.subject,
            text: emailTemplate.text,
            html: emailTemplate.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent:', info.messageId);
        
        return {
            success: true,
            messageId: info.messageId,
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
