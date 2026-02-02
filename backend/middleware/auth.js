import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthenticationError } from '../utils/errors.js';

/**
 * Protect routes - require valid JWT token
 */
export const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new AuthenticationError('No token provided. Please login.');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            throw new AuthenticationError('User not found');
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new AuthenticationError('Invalid token');
        } else if (error.name === 'TokenExpiredError') {
            throw new AuthenticationError('Token expired. Please login again.');
        } else {
            throw error;
        }
    }
};

/**
 * Admin only middleware
 */
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        throw new AuthenticationError('Admin access required');
    }
};
