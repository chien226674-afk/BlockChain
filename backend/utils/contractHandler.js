import { ethers } from 'ethers';
import { ContractError } from './errors.js';

/**
 * Smart Contract Error Handler
 * Parses and handles various smart contract errors
 */

/**
 * Parse contract revert reason
 * @param {Error} error - Error from contract call
 * @returns {string} - Human-readable error message
 */
export const parseContractError = (error) => {
    // User rejected transaction
    if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        return 'Transaction rejected by user';
    }

    // Insufficient funds
    if (error.code === 'INSUFFICIENT_FUNDS' || error.message?.includes('insufficient funds')) {
        return 'Insufficient funds to complete transaction';
    }

    // Gas estimation failed
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        return 'Transaction would fail. Please check contract conditions';
    }

    // Network errors
    if (error.code === 'NETWORK_ERROR') {
        return 'Network error. Please check your connection';
    }

    // Timeout
    if (error.code === 'TIMEOUT') {
        return 'Transaction timeout. Please try again';
    }

    // Nonce too low
    if (error.message?.includes('nonce too low')) {
        return 'Transaction nonce error. Please reset your wallet';
    }

    // Replacement transaction underpriced
    if (error.message?.includes('replacement transaction underpriced')) {
        return 'Transaction underpriced. Increase gas price';
    }

    // Try to extract revert reason
    if (error.reason) {
        return `Contract error: ${error.reason}`;
    }

    // Try to parse error data
    if (error.data) {
        try {
            const reason = ethers.toUtf8String('0x' + error.data.substring(138));
            return `Contract reverted: ${reason}`;
        } catch (e) {
            // Could not parse
        }
    }

    // Generic contract error
    if (error.message) {
        // Clean up error message
        const message = error.message
            .replace(/execution reverted:/gi, '')
            .replace(/Error:/gi, '')
            .trim();
        return message || 'Smart contract operation failed';
    }

    return 'Unknown contract error';
};

/**
 * Handle contract transaction with error handling
 * @param {Function} contractCall - Async function that calls contract
 * @param {string} operationName - Name of operation for logging
 * @returns {Promise} - Transaction result
 */
export const handleContractCall = async (contractCall, operationName = 'Contract operation') => {
    try {
        console.log(`Executing ${operationName}...`);
        
        const tx = await contractCall();
        console.log(`${operationName} transaction sent:`, tx.hash);
        
        const receipt = await tx.wait();
        console.log(`${operationName} confirmed in block:`, receipt.blockNumber);
        
        return {
            success: true,
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber,
            receipt
        };

    } catch (error) {
        console.error(`${operationName} failed:`, error);
        const message = parseContractError(error);
        throw new ContractError(message, error);
    }
};

/**
 * Estimate gas for contract call with buffer
 * @param {Function} contractCall - Contract call function
 * @param {number} bufferPercent - Buffer percentage (default 20%)
 * @returns {Promise<bigint>} - Estimated gas with buffer
 */
export const estimateGasWithBuffer = async (contractCall, bufferPercent = 20) => {
    try {
        const estimatedGas = await contractCall.estimateGas();
        const buffer = (estimatedGas * BigInt(bufferPercent)) / BigInt(100);
        return estimatedGas + buffer;
    } catch (error) {
        console.error('Gas estimation failed:', error);
        throw new ContractError('Failed to estimate gas: ' + parseContractError(error));
    }
};

/**
 * Wait for transaction confirmation with timeout
 * @param {object} tx - Transaction object
 * @param {number} confirmations - Number of confirmations to wait for
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<object>} - Transaction receipt
 */
export const waitForConfirmation = async (tx, confirmations = 1, timeout = 120000) => {
    try {
        const receipt = await Promise.race([
            tx.wait(confirmations),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Transaction timeout')), timeout)
            )
        ]);

        if (receipt.status === 0) {
            throw new ContractError('Transaction failed on-chain');
        }

        return receipt;

    } catch (error) {
        if (error.message === 'Transaction timeout') {
            throw new ContractError('Transaction confirmation timeout. It may still be pending');
        }
        throw new ContractError(parseContractError(error));
    }
};

/**
 * Validate contract address
 * @param {string} address - Contract address
 * @param {object} provider - Ethers provider
 * @returns {Promise<boolean>} - True if valid contract
 */
export const isValidContract = async (address, provider) => {
    try {
        if (!ethers.isAddress(address)) {
            return false;
        }

        const code = await provider.getCode(address);
        return code !== '0x';
    } catch (error) {
        console.error('Contract validation failed:', error);
        return false;
    }
};

/**
 * Parse contract event logs
 * @param {object} receipt - Transaction receipt
 * @param {object} contract - Contract instance
 * @param {string} eventName - Event name to parse
 * @returns {Array} - Parsed events
 */
export const parseContractEvents = (receipt, contract, eventName) => {
    try {
        const events = [];
        
        for (const log of receipt.logs) {
            try {
                const parsed = contract.interface.parseLog(log);
                if (parsed && parsed.name === eventName) {
                    events.push(parsed.args);
                }
            } catch (e) {
                // Skip logs that don't match
                continue;
            }
        }

        return events;
    } catch (error) {
        console.error('Event parsing failed:', error);
        return [];
    }
};

/**
 * Common contract error messages
 */
export const CONTRACT_ERRORS = {
    NOT_OWNER: 'You are not the owner of this NFT',
    ALREADY_LISTED: 'NFT is already listed for sale',
    NOT_LISTED: 'NFT is not listed for sale',
    INSUFFICIENT_PAYMENT: 'Insufficient payment amount',
    INVALID_PRICE: 'Invalid price specified',
    TRANSFER_FAILED: 'NFT transfer failed',
    APPROVAL_REQUIRED: 'NFT approval required before listing',
    ALREADY_SOLD: 'NFT has already been sold',
    INVALID_TOKEN: 'Invalid token ID',
    PAUSED: 'Contract is currently paused'
};
