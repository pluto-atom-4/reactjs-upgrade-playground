'use client';

import type { ReactNode } from 'react';

/**
 * FormMessage Component
 *
 * Displays form messages (success, error, etc.)
 */

export type MessageType = 'success' | 'error' | 'info' | 'warning';

export interface FormMessageProps {
  type: MessageType;
  message: ReactNode;
  className?: string;
}

export const FormMessage = ({
  type,
  message,
  className = '',
}: FormMessageProps) => {
  const baseStyles = 'px-4 py-3 rounded-md border';

  const typeStyles: Record<MessageType, string> = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  const icons: Record<MessageType, string> = {
    success: '✓',
    error: '✗',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]} ${className}`}>
      <span className="font-semibold">{icons[type]} </span>
      {message}
    </div>
  );
};

