import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;

    // Fix for Error object properties being non-enumerable
    if (err instanceof Error) {
        error.name = err.name;
        error.message = err.message;
    }

    // Mongoose validation or Custom Validation
    if (err.name === 'ValidationError') {
        const message = err.errors 
            ? Object.values(err.errors).map(e => e.message).join(', ')
            : err.message;
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') error = new AppError('Invalid token', 401);
    if (err.name === 'TokenExpiredError') error = new AppError('Token expired', 401);

    if (process.env.NODE_ENV !== 'test') {
        console.error(`Status: ${error.statusCode} | Message: ${error.message}`);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

export const notFound = (req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
