import { Request, Response, NextFunction } from 'express';
import * as passwordResetService from '@/services/auth/passwordResetService';
import ApiError from '@/utils/apiError';

// POST /api/auth/forgot-password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError('Email is required', 400);
    }

    await passwordResetService.sendPasswordResetEmail(email);

    res.status(200).json({
      success: true,
      message: 'Password reset code has been sent to your email',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-reset-code
export const verifyResetCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      throw new ApiError('Email and verification code are required', 400);
    }

    await passwordResetService.verifyResetCode(email, code);

    res.status(200).json({
      success: true,
      message: 'Verification code is valid',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      throw new ApiError('Email, code, and new password are required', 400);
    }

    if (newPassword.length < 6) {
      throw new ApiError('Password must be at least 6 characters long', 400);
    }

    await passwordResetService.resetPasswordWithCode(email, code, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
