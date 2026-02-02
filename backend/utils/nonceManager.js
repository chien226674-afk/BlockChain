/**
 * Nonce Manager - Prevents replay attacks
 * Tracks used nonces and ensures they expire after 15 minutes
 */

class NonceManager {
    constructor() {
        // Store nonces with their expiration times
        this.nonces = new Map();
        
        // Cleanup interval (every 5 minutes)
        this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
        
        // Nonce TTL (15 minutes)
        this.ttl = 15 * 60 * 1000;
    }

    /**
     * Generate a new nonce for a user
     * @param {string} userId - User ID
     * @param {string} nonce - Nonce string
     */
    createNonce(userId, nonce) {
        const key = `${userId}:${nonce}`;
        const expiresAt = Date.now() + this.ttl;
        
        this.nonces.set(key, {
            createdAt: Date.now(),
            expiresAt,
            used: false
        });
        
        return {
            nonce,
            expiresAt
        };
    }

    /**
     * Verify and consume a nonce (one-time use)
     * @param {string} userId - User ID
     * @param {string} nonce - Nonce to verify
     * @returns {boolean} - True if valid and unused
     */
    verifyAndConsume(userId, nonce) {
        const key = `${userId}:${nonce}`;
        const nonceData = this.nonces.get(key);
        
        if (!nonceData) {
            return false; // Nonce doesn't exist
        }

        if (nonceData.used) {
            return false; // Nonce already used (replay attack)
        }

        if (Date.now() > nonceData.expiresAt) {
            this.nonces.delete(key);
            return false; // Nonce expired
        }

        // Mark as used
        nonceData.used = true;
        this.nonces.set(key, nonceData);
        
        // Delete after use (one-time use)
        setTimeout(() => this.nonces.delete(key), 1000);
        
        return true;
    }

    /**
     * Check if a nonce exists and is valid (without consuming)
     * @param {string} userId - User ID
     * @param {string} nonce - Nonce to check
     * @returns {boolean}
     */
    isValid(userId, nonce) {
        const key = `${userId}:${nonce}`;
        const nonceData = this.nonces.get(key);
        
        if (!nonceData) {
            return false;
        }

        if (nonceData.used || Date.now() > nonceData.expiresAt) {
            return false;
        }

        return true;
    }

    /**
     * Invalidate a nonce
     * @param {string} userId - User ID
     * @param {string} nonce - Nonce to invalidate
     */
    invalidate(userId, nonce) {
        const key = `${userId}:${nonce}`;
        this.nonces.delete(key);
    }

    /**
     * Clean up expired nonces
     */
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, data] of this.nonces.entries()) {
            if (now > data.expiresAt) {
                this.nonces.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`[NonceManager] Cleaned up ${cleaned} expired nonces`);
        }
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            total: this.nonces.size,
            ttl: this.ttl / 1000 / 60 + ' minutes'
        };
    }

    /**
     * Destroy the manager (cleanup interval)
     */
    destroy() {
        clearInterval(this.cleanupInterval);
        this.nonces.clear();
    }
}

// Singleton instance
const nonceManager = new NonceManager();

export default nonceManager;
