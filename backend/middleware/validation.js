import Joi from 'joi';

/**
 * Validation Schemas for API Requests
 */

// User Registration
export const registerSchema = Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).min(3).max(30).required()
        .messages({
            'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username cannot exceed 30 characters',
            'any.required': 'Username is required'
        }),
    email: Joi.string().email().required().allow('')
        .messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required'
        }),
    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),
    walletAddress: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).optional()
        .messages({
            'string.pattern.base': 'Invalid Ethereum wallet address format'
        })
});

// User Login
export const loginSchema = Joi.object({
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().required()
}).xor('username', 'email')
  .messages({
      'object.missingVariant': 'Username or email is required'
  });

// Wallet Signature Verification
export const verifySignatureSchema = Joi.object({
    walletAddress: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).required()
        .messages({
            'string.pattern.base': 'Invalid Ethereum wallet address format',
            'any.required': 'Wallet address is required'
        }),
    signature: Joi.string().pattern(/^0x[a-fA-F0-9]{130}$/).required()
        .messages({
            'string.pattern.base': 'Invalid signature format',
            'any.required': 'Signature is required'
        })
});

// NFT Creation
export const createNFTSchema = Joi.object({
    tokenId: Joi.string().required()
        .messages({
            'any.required': 'Token ID is required'
        }),
    contractAddress: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).required()
        .messages({
            'string.pattern.base': 'Invalid contract address format',
            'any.required': 'Contract address is required'
        }),
    name: Joi.string().min(1).max(100).required()
        .messages({
            'string.min': 'NFT name cannot be empty',
            'string.max': 'NFT name cannot exceed 100 characters',
            'any.required': 'NFT name is required'
        }),
    description: Joi.string().max(1000).required()
        .messages({
            'string.max': 'Description cannot exceed 1000 characters',
            'any.required': 'Description is required'
        }),
    image: Joi.string().uri().required()
        .messages({
            'any.required': 'Image URL is required'
        }),
    tokenURI: Joi.string().uri().required()
        .messages({
            'any.required': 'Token URI is required'
        }),
    creatorId: Joi.string().optional(),
    ownerId: Joi.string().optional(),
    price: Joi.number().min(0).optional()
        .messages({
            'number.min': 'Price cannot be negative'
        }),
    itemId: Joi.string().optional().allow(null, '')
});

// Marketplace Listing
export const createListingSchema = Joi.object({
    tokenId: Joi.string().required()
        .messages({
            'any.required': 'Token ID is required'
        }),
    price: Joi.number().min(0.001).required()
        .messages({
            'number.min': 'Price must be at least 0.001 ETH',
            'any.required': 'Price is required'
        })
});

// Update Profile
export const updateProfileSchema = Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).min(3).max(30).optional(),
    email: Joi.string().email().optional().allow(''),
    bio: Joi.string().max(500).optional().allow(''),
    avatar: Joi.string().uri().optional().allow('')
});

// Ethereum Address Validation
export const ethereumAddressSchema = Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required()
    .messages({
        'string.pattern.base': 'Invalid Ethereum address format'
    });

/**
 * Validation Middleware Factory
 */
export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true // Remove unknown fields
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors
            });
        }

        // Replace req.body with validated and sanitized value
        req.body = value;
        next();
    };
};

/**
 * Validate Ethereum Address Middleware
 */
export const validateEthAddress = (paramName = 'address') => {
    return (req, res, next) => {
        const address = req.params[paramName];
        const { error } = ethereumAddressSchema.validate(address);

        if (error) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Ethereum address format'
            });
        }

        next();
    };
};
