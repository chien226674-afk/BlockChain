import toast from 'react-hot-toast';

/**
 * Frontend Error Handling Utilities with Toast Notifications
 */

export interface ApiError {
    message: string;
    status: number;
    details: Array<{ field: string; message: string }>;
    originalError?: any;
}

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error: any): string => {
    if (error?.message) {
        return error.message;
    }
    if (error?.response?.data?.error) {
        return error.response.data.error;
    }
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    return 'An unexpected error occurred';
};

/**
 * Extract validation errors from API response
 */
export const getValidationErrors = (error: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (error?.details && Array.isArray(error.details)) {
        error.details.forEach((detail: { field: string; message: string }) => {
            errors[detail.field] = detail.message;
        });
    }

    return errors;
};

/**
 * Check if error is a specific type
 */
export const isAuthError = (error: any): boolean => {
    return error?.status === 401;
};

export const isValidationError = (error: any): boolean => {
    return error?.status === 400 || error?.status === 422;
};

export const isNotFoundError = (error: any): boolean => {
    return error?.status === 404;
};

export const isServerError = (error: any): boolean => {
    return error?.status >= 500;
};

/**
 * Display error notification with toast
 */
export const showError = (error: any): void => {
    const message = getErrorMessage(error);

    // Log to console for debugging
    console.error('Error:', message, error);

    // Show toast notification
    if (isValidationError(error)) {
        const validationErrors = getValidationErrors(error);
        const errorMessages = Object.values(validationErrors);

        if (errorMessages.length > 0) {
            // Show first validation error
            toast.error(errorMessages[0]);
        } else {
            toast.error(message);
        }
    } else {
        toast.error(message);
    }
};

/**
 * Display success notification
 */
export const showSuccess = (message: string): void => {
    toast.success(message);
};

/**
 * Display info notification
 */
export const showInfo = (message: string): void => {
    toast(message, {
        icon: 'ℹ️',
    });
};

/**
 * Display loading notification
 */
export const showLoading = (message: string): string => {
    return toast.loading(message);
};

/**
 * Dismiss a specific toast
 */
export const dismissToast = (toastId: string): void => {
    toast.dismiss(toastId);
};

/**
 * Handle contract errors specifically
 */
export const handleContractError = (error: any): string => {
    const message = getErrorMessage(error);

    // Common contract error patterns
    if (message.includes('user rejected')) {
        showError({ message: 'Transaction rejected by user' });
        return 'Transaction rejected by user';
    }
    if (message.includes('insufficient funds')) {
        showError({ message: 'Insufficient funds to complete transaction' });
        return 'Insufficient funds to complete transaction';
    }
    if (message.includes('gas')) {
        showError({ message: 'Transaction would fail. Please check contract conditions' });
        return 'Transaction would fail. Please check contract conditions';
    }

    showError(error);
    return message;
};

/**
 * Retry logic for failed requests
 */
export const retryRequest = async <T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> => {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await requestFn();
        } catch (error: any) {
            lastError = error;

            // Don't retry on client errors (4xx)
            if (error?.status >= 400 && error?.status < 500) {
                throw error;
            }

            // Wait before retry
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }

    throw lastError;
};
