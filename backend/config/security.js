import dotenv from 'dotenv';

dotenv.config();

/**
 * Security Configuration
 * Centralized configuration for security settings
 */

export const securityConfig = {
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '7d',
        algorithm: 'HS256'
    },

    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        credentials: true,
        optionsSuccessStatus: 200
    },

    // Rate Limiting
    rateLimit: {
        auth: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 5
        },
        api: {
            windowMs: 15 * 60 * 1000,
            max: 100
        },
        upload: {
            windowMs: 60 * 60 * 1000, // 1 hour
            max: 10
        }
    },

    // Nonce Configuration
    nonce: {
        ttl: 15 * 60 * 1000, // 15 minutes
        cleanupInterval: 5 * 60 * 1000 // 5 minutes
    },

    // Helmet Security Headers
    helmet: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            }
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" }
    },

    // Environment
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,

    // Database
    mongoUri: process.env.MONGO_URI,

    // IPFS
    pinata: {
        apiKey: process.env.PINATA_API_KEY,
        secretKey: process.env.PINATA_SECRET_KEY
    }
};

/**
 * Validate required environment variables
 */
export const validateEnv = () => {
    const required = ['MONGO_URI', 'JWT_SECRET'];
    const missing = [];

    for (const key of required) {
        if (!process.env[key]) {
            missing.push(key);
        }
    }

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        console.error('Please check your .env file');
        process.exit(1);
    }

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters for security');
    }

    console.log('✅ Environment variables validated');
};

export default securityConfig;
