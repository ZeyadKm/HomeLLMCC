import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable loading spinner component
 * @param {Object} props
 * @param {string} props.message - Loading message to display
 * @param {string} props.size - Size: 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} props.fullScreen - Display as fullscreen overlay
 */
export default function LoadingSpinner({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const iconSize = sizeClasses[size] || sizeClasses.md;

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${iconSize} animate-spin text-headspace-orange`} />
      {message && <p className="text-gray-600 text-sm font-medium">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}
