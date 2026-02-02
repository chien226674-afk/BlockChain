/**
 * Custom Error Classes for NFT Marketplace
 */

export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends AppError {
    constructor(message = 'Not authorized to access this resource') {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

export class WalletError extends AppError {
    constructor(message = 'Wallet operation failed') {
        super(message, 400);
        this.name = 'WalletError';
    }
}

export class IPFSError extends AppError {
    constructor(message = 'IPFS upload failed') {
        super(message, 503);
        this.name = 'IPFSError';
    }
}

export class ContractError extends AppError {
    constructor(message = 'Smart contract operation failed', originalError = null) {
        super(message, 500);
        this.name = 'ContractError';
        this.originalError = originalError;
    }
}

export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed') {
        super(message, 500);
        this.name = 'DatabaseError';
    }
}
