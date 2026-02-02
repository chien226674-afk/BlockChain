import rateLimit from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';

const createLimiter = (options) => rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    validate: false,
    skip: () => isTest,
    ...options
});

export const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100, // Increased for testing
    message: { success: false, error: 'Too many authentication attempts. Please try again later.' }
});

export const strictAuthLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100 // Increased for testing
});

export const apiLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'Rate limit exceeded. Please slow down.' }
});

export const uploadLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10
});

export const createNFTLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 20
});

export const moderateLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 50
});

export default {
    authLimiter,
    strictAuthLimiter,
    apiLimiter,
    uploadLimiter,
    createNFTLimiter,
    moderateLimiter
};
