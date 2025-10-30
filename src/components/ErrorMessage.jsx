import React from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * Reusable error message component
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onClose - Optional close handler
 * @param {string} props.variant - Variant: 'error', 'warning', 'info' (default: 'error')
 */
export default function ErrorMessage({ message, onClose, variant = 'error' }) {
  if (!message) return null;

  const variants = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      text: 'text-red-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-500',
      text: 'text-yellow-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
      text: 'text-blue-800',
    },
  };

  const style = variants[variant] || variants.error;

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-xl p-4 flex items-start gap-3`}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className={`w-5 h-5 ${style.icon} flex-shrink-0 mt-0.5`} />
      <p className={`${style.text} text-sm flex-1`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.icon} hover:opacity-70 transition-opacity flex-shrink-0`}
          aria-label="Close error message"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
