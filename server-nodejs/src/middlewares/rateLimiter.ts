import rateLimit from 'express-rate-limit';

// 5 registration attempts per 15 minutes per IP.
export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many registration attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// 10 login attempts per 15 minutes per IP.
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many login attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// 3 requests per 60 minutes per IP.
export const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { message: 'Too many password reset requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// 5 verification attempts per 15 minutes per IP.
export const verifyResetCodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many verification attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});


// 3 requests per 60 minutes per IP.
export const resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { message: 'Too many password reset attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
