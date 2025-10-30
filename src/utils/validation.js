/**
 * Input validation utilities
 */

/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (trimmed.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  return { valid: true };
}

/**
 * Validates a US phone number
 * @param {string} phone - Phone number to validate
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required' };
  }

  const trimmed = phone.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Remove common formatting characters
  const cleaned = trimmed.replace(/[\s\-().]/g, '');

  // Check if it's a valid US phone number (10 or 11 digits)
  const phoneRegex = /^1?[2-9]\d{9}$/;

  if (!phoneRegex.test(cleaned)) {
    return { valid: false, error: 'Invalid US phone number format' };
  }

  return { valid: true };
}

/**
 * Validates required fields in form data
 * @param {Object} data - Form data object
 * @param {string[]} requiredFields - Array of required field names
 * @returns {{valid: boolean, missing?: string[]}} Validation result
 */
export function validateRequiredFields(data, requiredFields) {
  const missing = requiredFields.filter((field) => {
    const value = data[field];
    return !value || (typeof value === 'string' && value.trim() === '');
  });

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}

/**
 * Validates US state code
 * @param {string} state - Two-letter state code
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export function validateState(state) {
  if (!state || typeof state !== 'string') {
    return { valid: false, error: 'State is required' };
  }

  const statesList = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
    'DC',
  ];

  const upper = state.trim().toUpperCase();

  if (!statesList.includes(upper)) {
    return { valid: false, error: 'Invalid state code' };
  }

  return { valid: true };
}

/**
 * Validates file size
 * @param {File} file - File object to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export function validateFileSize(file, maxSize = 5242880) {
  if (!file) {
    return { valid: false, error: 'File is required' };
  }

  if (file.size > maxSize) {
    const maxMB = (maxSize / 1024 / 1024).toFixed(1);
    const fileMB = (file.size / 1024 / 1024).toFixed(1);
    return {
      valid: false,
      error: `File size (${fileMB}MB) exceeds maximum allowed size (${maxMB}MB)`,
    };
  }

  return { valid: true };
}

/**
 * Validates file type
 * @param {File} file - File object to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export function validateFileType(file, allowedTypes) {
  if (!file) {
    return { valid: false, error: 'File is required' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Sanitizes text input
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') return '';

  return text
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 10000); // Limit length
}
