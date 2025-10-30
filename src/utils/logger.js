/**
 * Logger utility for consistent logging across the application
 * Respects DEBUG_MODE environment variable
 */

const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

/**
 * Logs debug messages (only in debug mode)
 * @param {string} context - The context/module name
 * @param {...any} args - Arguments to log
 */
export function debug(context, ...args) {
  if (DEBUG_MODE) {
    console.log(`[${context}]`, ...args);
  }
}

/**
 * Logs info messages
 * @param {string} context - The context/module name
 * @param {...any} args - Arguments to log
 */
export function info(context, ...args) {
  if (DEBUG_MODE) {
    console.info(`[${context}]`, ...args);
  }
}

/**
 * Logs warning messages (always shown)
 * @param {string} context - The context/module name
 * @param {...any} args - Arguments to log
 */
export function warn(context, ...args) {
  console.warn(`[${context}]`, ...args);
}

/**
 * Logs error messages (always shown)
 * @param {string} context - The context/module name
 * @param {...any} args - Arguments to log
 */
export function error(context, ...args) {
  console.error(`[${context}]`, ...args);
}

/**
 * Groups related log messages
 * @param {string} label - Group label
 * @param {Function} fn - Function containing log statements
 */
export function group(label, fn) {
  if (DEBUG_MODE) {
    console.group(label);
    fn();
    console.groupEnd();
  }
}

export default {
  debug,
  info,
  warn,
  error,
  group,
};
