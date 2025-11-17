'use client';

import type { InputHTMLAttributes } from 'react';

/**
 * FormInput Component
 *
 * Reusable form input component with label, error handling, and helper text
 */

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  containerClassName?: string;
}

export const FormInput = ({
  label,
  error,
  helper,
  required = false,
  containerClassName = '',
  name,
  type = 'text',
  ...inputProps
}: FormInputProps) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
          error
            ? 'border-red-400 focus:ring-red-500 bg-red-50'
            : 'border-gray-300 focus:ring-blue-500'
        } disabled:bg-gray-100`}
        {...inputProps}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helper && !error && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
    </div>
  );
};

