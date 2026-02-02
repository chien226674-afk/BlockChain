import { AuthenticationError } from '../utils/errors.js';

/**
 * Role-Based Access Control Middleware
 */

/**
 * Require specific role(s)
 * @param {string|string[]} roles - Required role(s)
 */
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AuthenticationError('Authentication required');
        }

        const hasRole = roles.includes(req.user.role);
        
        if (!hasRole) {
            throw new AuthenticationError(`Access denied. Required role: ${roles.join(' or ')}`);
        }

        next();
    };
};

/**
 * Require admin role
 */
export const requireAdmin = requireRole('admin');

/**
 * Check if user is the owner of a resource
 * @param {Function} getResourceId - Function to extract resource owner ID from request
 */
export const isOwner = (getResourceId) => {
    return async (req, res, next) => {
        if (!req.user) {
            throw new AuthenticationError('Authentication required');
        }

        const resourceOwnerId = await getResourceId(req);
        
        // Admin can access everything
        if (req.user.role === 'admin') {
            return next();
        }

        // Check if user is the owner
        if (resourceOwnerId.toString() !== req.user._id.toString()) {
            throw new AuthenticationError('You do not have permission to access this resource');
        }

        next();
    };
};

/**
 * Check if user is the creator of a resource
 * @param {Function} getCreatorId - Function to extract creator ID from request
 */
export const isCreator = (getCreatorId) => {
    return async (req, res, next) => {
        if (!req.user) {
            throw new AuthenticationError('Authentication required');
        }

        const creatorId = await getCreatorId(req);
        
        // Admin can access everything
        if (req.user.role === 'admin') {
            return next();
        }

        // Check if user is the creator
        if (creatorId.toString() !== req.user._id.toString()) {
            throw new AuthenticationError('You do not have permission to modify this resource');
        }

        next();
    };
};

/**
 * Allow owner or admin
 */
export const ownerOrAdmin = (getResourceId) => {
    return async (req, res, next) => {
        if (!req.user) {
            throw new AuthenticationError('Authentication required');
        }

        // Admin always allowed
        if (req.user.role === 'admin') {
            return next();
        }

        const resourceOwnerId = await getResourceId(req);
        
        if (resourceOwnerId.toString() !== req.user._id.toString()) {
            throw new AuthenticationError('Access denied. Admin or owner required.');
        }

        next();
    };
};
