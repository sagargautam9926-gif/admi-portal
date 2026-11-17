import React from 'react';

export const FormField = ({
  id,
  label,
  error,
  required = false,
  helperText,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs sm:text-sm font-medium text-brand-text flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-red-400 ml-1 font-bold">*</span>}
          </span>
        </label>
      )}

      {children}

      {helperText && !error && (
        <p className="text-xs text-brand-muted">{helperText}</p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-red-400 flex items-center gap-1 animate-fadeIn"
        >
          <span>•</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormField;

