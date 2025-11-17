/**
 * Custom Form Component with React 19 Form Actions
 *
 * Based on Chapter 03: <form> and actions from:
 * https://zenn.dev/uhyo/books/react-19-new/viewer/form-action
 *
 * Demonstrates:
 * - Server Action integration with <form>
 * - useActionState for form state management
 * - Field validation and error handling
 * - Progressive enhancement
 * - Custom form component abstraction
 */

'use client';

import type { ReactNode, FormHTMLAttributes } from 'react';
import { useActionState } from 'react';
import { FormInput } from './FormInput';
import { FormButton } from './FormButton';
import { FormMessage } from './FormMessage';

// ============================================================================
// Types
// ============================================================================

export type FormState<T extends Record<string, unknown> = Record<string, unknown>> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  data?: T;
};

export interface CustomFormProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'action'> {
  /** Server action function that handles form submission */
  action: (prevState: FormState<T>, formData: FormData) => Promise<FormState<T>>;

  /** Children form fields */
  children: ReactNode;

  /** Optional callback on successful submission */
  onSuccess?: (data: T) => void;

  /** Custom submit button text */
  submitButtonText?: string;

  /** Custom pending button text */
  pendingButtonText?: string;

  /** Whether to reset form on success */
  resetOnSuccess?: boolean;

  /** CSS class for the form wrapper */
  containerClassName?: string;

  /** CSS class for the form element */
  formClassName?: string;
}

// ============================================================================
// Main Custom Form Component
// ============================================================================

export const CustomForm = <T extends Record<string, unknown> = Record<string, unknown>>({
  action,
  children,
  onSuccess,
  submitButtonText = 'Submit',
  pendingButtonText = 'Submitting...',
  resetOnSuccess = true,
  containerClassName = '',
  formClassName = '',
  ...formProps
}: CustomFormProps<T>) => {
  const [state, formAction, isPending] = useActionState(action, {
    success: false,
  } as FormState<T>);

  // Trigger callback on success
  if (state.success && onSuccess && state.data) {
    onSuccess(state.data);
  }

  return (
    <div className={containerClassName}>
      <form action={formAction} className={formClassName} {...formProps}>
        {/* Render form fields */}
        <fieldset disabled={isPending} className="space-y-4">
          {children}

          {/* Form Button */}
          <FormButton
            type="submit"
            disabled={isPending}
            isLoading={isPending}
            loadingText={pendingButtonText}
          >
            {submitButtonText}
          </FormButton>
        </fieldset>
      </form>

      {/* Success Message */}
      {state.success && state.message && (
        <FormMessage type="success" message={state.message} />
      )}

      {/* Error Message (General) */}
      {!state.success && state.message && (
        <FormMessage type="error" message={state.message} />
      )}

      {/* Field Errors */}
      {state.errors && Object.keys(state.errors).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(state.errors).map(([field, error]) => (
            <FormMessage
              key={field}
              type="error"
              message={`${field}: ${error}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Reusable Form Input Component
// ============================================================================

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  containerClassName?: string;
}

export const FormField = ({
  label,
  error,
  helper,
  required = false,
  containerClassName = '',
  ...inputProps
}: FormInputProps) => {
  return (
    <FormInput
      label={label || (inputProps.name as string)}
      error={error}
      helper={helper}
      required={required}
      containerClassName={containerClassName}
      {...inputProps}
    />
  );
};

// ============================================================================
// Helper Types for Action Functions
// ============================================================================

/**
 * Helper type for creating validated FormData
 */
export type FormDataExtractor = {
  string: (name: string) => string;
  number: (name: string) => number;
  boolean: (name: string) => boolean;
  optional: {
    string: (name: string) => string | null;
    number: (name: string) => number | null;
  };
};

/**
 * Create a FormData extractor with type safety
 */
export function createFormDataExtractor(formData: FormData): FormDataExtractor {
  return {
    string: (name: string) => {
      const value = formData.get(name);
      if (typeof value !== 'string') throw new Error(`Missing field: ${name}`);
      return value;
    },
    number: (name: string) => {
      const value = formData.get(name);
      if (typeof value !== 'string') throw new Error(`Missing field: ${name}`);
      const num = Number(value);
      if (isNaN(num)) throw new Error(`Invalid number for field: ${name}`);
      return num;
    },
    boolean: (name: string) => {
      const value = formData.get(name);
      return value === 'on' || value === 'true';
    },
    optional: {
      string: (name: string) => {
        const value = formData.get(name);
        return typeof value === 'string' && value.length > 0 ? value : null;
      },
      number: (name: string) => {
        const value = formData.get(name);
        if (typeof value !== 'string' || value.length === 0) return null;
        const num = Number(value);
        return isNaN(num) ? null : num;
      },
    },
  };
}

// ============================================================================
// Validation Helper
// ============================================================================

export type ValidationRule = {
  validate: (value: string) => boolean;
  message: string;
};

export function createValidationRules() {
  return {
    required: (fieldName: string): ValidationRule => ({
      validate: (value: string) => value.trim().length > 0,
      message: `${fieldName} is required`,
    }),
    email: (): ValidationRule => ({
      validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address',
    }),
    minLength: (length: number, fieldName: string): ValidationRule => ({
      validate: (value: string) => value.length >= length,
      message: `${fieldName} must be at least ${length} characters`,
    }),
    maxLength: (length: number, fieldName: string): ValidationRule => ({
      validate: (value: string) => value.length <= length,
      message: `${fieldName} must be at most ${length} characters`,
    }),
    pattern: (pattern: RegExp, fieldName: string): ValidationRule => ({
      validate: (value: string) => pattern.test(value),
      message: `${fieldName} format is invalid`,
    }),
    minValue: (min: number, fieldName: string): ValidationRule => ({
      validate: (value: string) => Number(value) >= min,
      message: `${fieldName} must be at least ${min}`,
    }),
    match: (
      otherValue: string,
      fieldName: string,
      otherFieldName: string,
    ): ValidationRule => ({
      validate: (value: string) => value === otherValue,
      message: `${fieldName} must match ${otherFieldName}`,
    }),
  };
}

export function validateField(
  value: string,
  rules: ValidationRule[],
): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
}

// ============================================================================
// Preset Form Components
// ============================================================================

/**
 * Contact form action - ready to use
 */
export async function contactFormAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const extractor = createFormDataExtractor(formData);
    const name = extractor.string('name');
    const email = extractor.string('email');
    const message = extractor.string('message');

    // Validation
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.includes('@')) {
      errors.email = 'Invalid email address';
    }

    if (message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please fix the errors below',
        errors,
      };
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: `Thank you ${name}! We received your message and will reply soon.`,
      data: { name, email, message },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

/**
 * Newsletter subscription action
 */
export async function newsletterAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const email = formData.get('email') as string;

    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address',
        errors: { email: 'Invalid email' },
      };
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: `You've been subscribed! Check ${email} for confirmation.`,
      data: { email },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to subscribe. Please try again.',
    };
  }
}

