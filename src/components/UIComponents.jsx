import React, { useState } from 'react';
import { Info, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Tooltip Component
export function Tooltip({ children, text, position = 'top' }) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </div>
      {visible && (
        <div className={`tooltip tooltip-visible whitespace-nowrap ${positionClasses[position]}`}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' :
            position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' :
            position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2' :
            'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'
          }`}></div>
        </div>
      )}
    </div>
  );
}

// Enhanced Input Field with Label and Error
export function InputField({
  label,
  error,
  required,
  tooltip,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {tooltip && (
            <Tooltip text={tooltip} position="right">
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          )}
        </div>
      )}
      <input
        className={`input-field ${error ? 'input-field-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1 fade-in">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

// Enhanced Select Field
export function SelectField({
  label,
  error,
  required,
  tooltip,
  children,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {tooltip && (
            <Tooltip text={tooltip} position="right">
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          )}
        </div>
      )}
      <select
        className={`input-field ${error ? 'input-field-error' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1 fade-in">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

// Enhanced Textarea Field
export function TextareaField({
  label,
  error,
  required,
  tooltip,
  className = '',
  rows = 4,
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {tooltip && (
            <Tooltip text={tooltip} position="right">
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          )}
        </div>
      )}
      <textarea
        rows={rows}
        className={`input-field resize-y ${error ? 'input-field-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1 fade-in">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

// Loading Skeleton
export function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    card: 'h-32 w-full rounded-xl'
  };

  return <div className={`skeleton ${variants[variant]} ${className}`}></div>;
}

// Enhanced Loading State
export function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}

// Alert Component
export function Alert({ type = 'info', children, onClose, className = '' }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const icons = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />
  };

  return (
    <div className={`border-2 rounded-lg p-4 flex items-start gap-3 fade-in ${styles[type]} ${className}`}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>
      <div className="flex-1">
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Progress Steps
export function ProgressSteps({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-blue-600 text-white pulse-glow'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`text-xs mt-2 font-medium ${
              index === currentStep ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  index < currentStep ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'
                }`}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Card Component
export function Card({ children, className = '', hover = true }) {
  return (
    <div className={`card ${!hover && 'hover:shadow-lg'} ${className}`}>
      {children}
    </div>
  );
}

// Badge Component
export function Badge({ children, variant = 'info', className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}

// Section Header
export function SectionHeader({ title, description, icon: Icon, action }) {
  return (
    <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Empty State
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
