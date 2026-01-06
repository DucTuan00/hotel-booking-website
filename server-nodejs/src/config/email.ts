import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App Password for Gmail
    },
};

// Create transporter
export const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Email templates
export const emailTemplates = {
    resetPasswordCode: (code: string, expiryMinutes: number = 10) => ({
        subject: 'Đặt lại mật khẩu - Lion Hotel Boutique',
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
            <h1>Lion Hotel Boutique</h1>
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
};
