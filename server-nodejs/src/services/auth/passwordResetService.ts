import { resend, EMAIL_FROM, emailTemplates } from '@/config/email';
import PasswordReset from '@/models/PasswordReset';
import User from '@/models/User';
import ApiError from '@/utils/apiError';
import bcrypt from 'bcryptjs';

const EXPIRY_MINUTES = 10;

// Generate 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError('No account found with this email address', 404);
    }

    // Generate verification code
    const code = generateVerificationCode();

    // Calculate expiry time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + EXPIRY_MINUTES);

    // Delete any existing unused codes for this email
    await PasswordReset.deleteMany({ email: email.toLowerCase(), used: false });

    // Save new reset code
    await PasswordReset.create({
      email: email.toLowerCase(),
      code,
      expiresAt,
      used: false,
    });

    // Send email using Resend
    const template = emailTemplates.resetPasswordCode(code, EXPIRY_MINUTES);
    const { data, error } = await resend.emails.send({
      from: `Lion Hotel Boutique <${EMAIL_FROM}>`,
      to: [email],
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      throw new ApiError('Failed to send password reset email', 500);
    }

    console.log('Password reset email sent:', data?.id);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error sending password reset email:', error);
    throw new ApiError('Failed to send password reset email', 500);
  }
};

// Verify reset code
export const verifyResetCode = async (
  email: string,
  code: string
): Promise<boolean> => {
  try {
    const resetRecord = await PasswordReset.findOne({
      email: email.toLowerCase(),
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      throw new ApiError('Invalid or expired verification code', 400);
    }

    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to verify code', 500);
  }
};

// Reset password with verification code
export const resetPasswordWithCode = async (
  email: string,
  code: string,
  newPassword: string
): Promise<void> => {
  try {
    // Find valid reset record
    const resetRecord = await PasswordReset.findOne({
      email: email.toLowerCase(),
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      throw new ApiError('Invalid or expired verification code', 400);
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Mark reset code as used
    resetRecord.used = true;
    await resetRecord.save();

    // Delete all other unused codes for this email
    await PasswordReset.deleteMany({
      email: email.toLowerCase(),
      _id: { $ne: resetRecord._id },
      used: false,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error resetting password:', error);
    throw new ApiError('Failed to reset password', 500);
  }
};
