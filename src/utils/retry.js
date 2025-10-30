/**
 * Retry utilities for handling transient failures
 */

import { error as logError, debug } from './logger';

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.initialDelay - Initial delay in ms (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 10000)
 * @param {Function} options.shouldRetry - Function to determine if error should be retried
 * @param {string} options.context - Context for logging
 * @returns {Promise<any>} Result of the function
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true,
    context = 'Retry',
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      debug(context, `Attempt ${attempt + 1}/${maxRetries + 1}`);
      const result = await fn();

      if (attempt > 0) {
        debug(context, `Succeeded after ${attempt} retries`);
      }

      return result;
    } catch (err) {
      lastError = err;

      // Don't retry if we've exhausted attempts
      if (attempt === maxRetries) {
        logError(context, `Failed after ${maxRetries + 1} attempts:`, err.message);
        break;
      }

      // Check if we should retry this error
      if (!shouldRetry(err)) {
        logError(context, 'Error is not retryable:', err.message);
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      debug(context, `Retry ${attempt + 1} failed, waiting ${delay}ms before retry...`);

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Retry specifically for fetch requests
 * @param {string} url - URL to fetch
 * @param {RequestInit} options - Fetch options
 * @param {Object} retryOptions - Retry options
 * @returns {Promise<Response>} Fetch response
 */
export async function fetchWithRetry(url, options = {}, retryOptions = {}) {
  return retryWithBackoff(
    async () => {
      const response = await fetch(url, options);

      // Retry on 5xx errors and 429 (rate limit)
      if (response.status >= 500 || response.status === 429) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.response = response;
        error.status = response.status;
        throw error;
      }

      return response;
    },
    {
      ...retryOptions,
      shouldRetry: (err) => {
        // Retry on network errors or 5xx/429 status codes
        if (!err.response) return true; // Network error
        if (err.status === 429) return true; // Rate limit
        if (err.status >= 500) return true; // Server error
        return false;
      },
      context: retryOptions.context || 'Fetch',
    }
  );
}

/**
 * Timeout wrapper for promises
 * @param {Promise} promise - Promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} timeoutMessage - Error message on timeout
 * @returns {Promise<any>} Result of the promise
 */
export async function withTimeout(promise, timeoutMs, timeoutMessage = 'Operation timed out') {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
