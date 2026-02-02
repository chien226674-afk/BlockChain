import multer from 'multer';
import path from 'path';
import { IPFSError } from '../utils/errors.js';

/**
 * File Upload Middleware with Validation
 */

// Configure storage (disk storage for Pinata uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(
            new IPFSError('Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG images are allowed'),
            false
        );
    }
    
    cb(null, true);
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max file size
        files: 1 // Single file upload
    },
    fileFilter: imageFilter
});

/**
 * Single file upload middleware
 */
export const uploadSingle = upload.single('image');

/**
 * Multiple files upload middleware (up to 10 files)
 */
export const uploadMultiple = upload.array('images', 10);

/**
 * Validate uploaded file
 */
export const validateUploadedFile = (req, res, next) => {
    if (!req.file) {
        return next(new IPFSError('No file uploaded'));
    }

    // Additional validation
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (req.file.size > maxSize) {
        return next(new IPFSError(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`));
    }

    // Validate file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const ext = path.extname(req.file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
        return next(new IPFSError('Invalid file extension'));
    }

    next();
};

/**
 * Error handler for multer errors
 */
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new IPFSError('File too large. Maximum size is 100MB'));
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            return next(new IPFSError('Too many files. Maximum is 10 files'));
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(new IPFSError('Unexpected file field'));
        } else {
            return next(new IPFSError(`Upload error: ${err.message}`));
        }
    }
    
    next(err);
};

export default upload;
