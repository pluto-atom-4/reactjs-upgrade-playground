'use client';

import type { ButtonHTMLAttributes } from 'react';

/**
 * FormButton Component
 *
 * Reusable form button with loading state support
 */

export interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export const FormButton = ({
  isLoading = false,
  loadingText = 'Loading...',
  disabled,
  children,
  className = '',
  ...buttonProps
}: FormButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center justify-center gap-2 ${className}`}
      {...buttonProps}
    >
      {isLoading && (
        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      )}
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
};

