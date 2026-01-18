import { Resend } from 'resend';
import { PaymentMethod } from '@/types/booking';

// Initialize Resend
// Resend API Key from environment variable
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
    console.warn('RESEND_API_KEY not found in environment variables. Email functionality will not work.');
}

export const resend = new Resend(resendApiKey);

// Email sender configuration
// Must be a verified domain/email in Resend dashboard
export const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

// Verify Resend is ready (optional check)
if (resendApiKey) {
    console.log('Resend email service initialized');
}

// Email templates
export const emailTemplates = {
    resetPasswordCode: (code: string, expiryMinutes: number = 10) => ({
        subject: 'Đặt lại mật khẩu - Lion Boutique Hotel',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #8B1A1A; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #D4902A; text-align: center; letter-spacing: 5px; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          .warning { color: #8B1A1A; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Lion Boutique Hotel</h1>
          </div>
          <div class="content">
            <h2>Đặt lại mật khẩu</h2>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã xác thực bên dưới để hoàn tất quá trình:</p>
            <div class="code">${code}</div>
            <p class="warning">Mã này sẽ hết hạn sau ${expiryMinutes} phút.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ nếu bạn có thắc mắc.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Hotel Boutique. Mọi quyền được bảo lưu.</p>
            <p>Đây là email tự động. Vui lòng không trả lời tin nhắn này.</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `
      Đặt lại mật khẩu
      
      Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã xác thực bên dưới:
      
      ${code}
      
      Mã này sẽ hết hạn sau ${expiryMinutes} phút.
      
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
      
      Hotel Boutique
    `,
    }),

    bookingConfirmation: (bookingData: {
        bookingId: string;
        customerName: string;
        roomName: string;
        roomType: string;
        checkIn: string;
        checkOut: string;
        nights: number;
        quantity: number;
        guests: { adults: number; children?: number };
        totalPrice: number;
        paymentMethod: string;
        celebrateItems?: Array<{ name: string; quantity: number; price: number }>;
        discount?: { tier: string; percent: number; amount: number };
    }) => ({
        subject: 'Xác nhận đặt phòng - Lion Boutique Hotel',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #8B1A1A; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0; }
          .booking-id { font-size: 24px; font-weight: bold; color: #D4902A; text-align: center; padding: 15px; background: white; border-radius: 5px; margin: 20px 0; }
          .info-section { background: white; padding: 20px; border-radius: 5px; margin: 15px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .info-label { font-weight: bold; color: #666; }
          .info-value { color: #333; }
          .price-section { background: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 2px solid #D4902A; }
          .total-price { font-size: 24px; font-weight: bold; color: #8B1A1A; text-align: right; }
          .discount-badge { background: #D4902A; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; font-weight: bold; }
          .celebrate-items { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .celebrate-item { padding: 8px 0; border-bottom: 1px solid #eee; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          .note { background: #fff3cd; border-left: 4px solid #D4902A; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Lion Boutique Hotel</h1>
          </div>
          <div class="content">
            <h2>Xác nhận đặt phòng</h2>
            <p>Kính gửi <strong>${bookingData.customerName}</strong>,</p>
            <p>Cảm ơn bạn đã chọn Lion Boutique Hotel! Chúng tôi đã nhận được đơn đặt phòng của bạn.</p>
            
            <div class="booking-id">
              Mã đặt phòng: ${bookingData.bookingId}
            </div>

            <div class="info-section">
              <h3 style="margin-top: 0; color: #8B1A1A;">Thông tin phòng</h3>
              <div class="info-row">
                <span class="info-label">Loại phòng: </span>
                <span class="info-value">${bookingData.roomName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Hạng phòng: </span>
                <span class="info-value">${bookingData.roomType}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Số lượng phòng: </span>
                <span class="info-value">${bookingData.quantity} phòng</span>
              </div>
              <div class="info-row">
                <span class="info-label">Số khách: </span>
                <span class="info-value">${bookingData.guests.adults} người lớn${bookingData.guests.children ? `, ${bookingData.guests.children} trẻ em` : ''}</span>
              </div>
            </div>

            <div class="info-section">
              <h3 style="margin-top: 0; color: #8B1A1A;">Thời gian lưu trú</h3>
              <div class="info-row">
                <span class="info-label">Nhận phòng: </span>
                <span class="info-value">${bookingData.checkIn}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Trả phòng: </span>
                <span class="info-value">${bookingData.checkOut}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Số đêm: </span>
                <span class="info-value">${bookingData.nights} đêm</span>
              </div>
            </div>

            ${bookingData.celebrateItems && bookingData.celebrateItems.length > 0 ? `
            <div class="celebrate-items">
              <h3 style="margin-top: 0; color: #8B1A1A;">Dịch vụ bổ sung</h3>
              ${bookingData.celebrateItems.map(item => `
                <div class="celebrate-item">
                  <div style="display: flex; justify-content: space-between;">
                    <span>${item.name} x${item.quantity}: </span>
                    <span>${item.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <div class="price-section">
              <h3 style="margin-top: 0; color: #8B1A1A;">Chi tiết thanh toán</h3>
              <div class="info-row">
                <span class="info-label">Phương thức: </span>
                <span class="info-value">${bookingData.paymentMethod === PaymentMethod.ONSITE ? 'Thanh toán tại quầy' : 'Thanh toán Online'}</span>
              </div>
              ${bookingData.discount ? `
              <div class="info-row">
                <span class="info-label">
                  Giảm giá <span class="discount-badge">${bookingData.discount.tier}</span>:
                </span>
                <span class="info-value" style="color: #D4902A;">-${bookingData.discount.amount.toLocaleString('vi-VN')}đ (${bookingData.discount.percent}%)</span>
              </div>
              ` : ''}
              <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #D4902A;">
                <div class="total-price">
                  Tổng cộng: ${bookingData.totalPrice.toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>

            <div class="note">
              <strong>Lưu ý:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Vui lòng mang theo CMND/CCCD khi nhận phòng</li>
                <li>Giờ nhận phòng: 14:00 | Giờ trả phòng: 12:00</li>
                <li>Đơn đặt phòng của bạn đang được xử lý từ khách sạn</li>
              </ul>
            </div>

            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ:</p>
            <ul>
              <li>Hotline: 0987654321</li>
              <li>Email: support@lionboutiquehotel.com</li>
            </ul>

            <p style="margin-top: 30px;">Chúng tôi rất mong được phục vụ quý khách!</p>
            <p style="color: #D4902A; font-weight: bold;">Trân trọng,<br>Lion Boutique Hotel Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Lion Boutique Hotel. Mọi quyền được bảo lưu.</p>
            <p>Đây là email tự động. Vui lòng không trả lời tin nhắn này.</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `
      Xác nhận đặt phòng - Lion Boutique Hotel
      
      Kính gửi ${bookingData.customerName},
      
      Cảm ơn bạn đã chọn Lion Boutique Hotel! Chúng tôi đã nhận được đơn đặt phòng của bạn.
      
      Mã đặt phòng: ${bookingData.bookingId}
      
      THÔNG TIN PHÒNG
      - Loại phòng: ${bookingData.roomName}
      - Hạng phòng: ${bookingData.roomType}
      - Số lượng: ${bookingData.quantity} phòng
      - Số khách: ${bookingData.guests.adults} người lớn${bookingData.guests.children ? `, ${bookingData.guests.children} trẻ em` : ''}
      
      THỜI GIAN LƯU TRÚ
      - Nhận phòng: ${bookingData.checkIn}
      - Trả phòng: ${bookingData.checkOut}
      - Số đêm: ${bookingData.nights} đêm
      
      ${bookingData.celebrateItems && bookingData.celebrateItems.length > 0 ? `
      DỊCH VỤ BỔ SUNG
      ${bookingData.celebrateItems.map(item => `- ${item.name} x ${item.quantity}: ${item.price.toLocaleString('vi-VN')}đ`).join('\n')}
      ` : ''}
      
      CHI TIẾT THANH TOÁN
      - Phương thức: ${bookingData.paymentMethod === PaymentMethod.ONSITE ? 'Thanh toán tại quầy' : 'Thanh toán Online'}
      ${bookingData.discount ? `- Giảm giá ${bookingData.discount.tier}: -${bookingData.discount.amount.toLocaleString('vi-VN')}đ (${bookingData.discount.percent}%)` : ''}
      - Tổng cộng: ${bookingData.totalPrice.toLocaleString('vi-VN')}đ
      
      LƯU Ý:
      - Vui lòng mang theo CMND/CCCD khi nhận phòng
      - Giờ nhận phòng: 14:00 | Giờ trả phòng: 12:00
      - Đơn đặt phòng của bạn đang được xử lý và chờ xác nhận
      - Bạn sẽ nhận được email xác nhận khi đơn đặt phòng được duyệt
      
      Liên hệ:
      - Hotline: 0987654321
      - Email: support@lionboutiquehotel.com
      
      Chúng tôi rất mong được phục vụ quý khách!
      
      Trân trọng,
      Lion Boutique Hotel Team
    `,
    }),
};
