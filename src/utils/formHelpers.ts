/**
 * src/utils/formHelpers.ts
 *
 * Small collection of form-related helpers used by the React19 demos.
 * Purpose:
 * - Provide a tiny, typed FormState shape for action handlers.
 * - Offer a safe FormData extractor helpers to coerce and validate values.
 * - Simple validation rule factories and a helper to run them.
 * - Two small preset actions (contactFormAction, newsletterAction) used in demos.
 *
 * Usage examples:
 *
 * Importing (recommended):
 * ```ts
 * // If your project resolves `~` to /src
 * import { createFormDataExtractor, contactFormAction } from '~/utils/formHelpers';
 *
 * // Or with a relative path from a component in src/components:
 * import { contactFormAction } from '../utils/formHelpers';
 * ```
 *
 * Example: using with React 19's useActionState
 * ```tsx
 * import { useActionState } from 'react';
 * import { contactFormAction } from '~/utils/formHelpers';
 *
 * export function ContactForm() {
 *   const [state, formAction, isPending] = useActionState(contactFormAction);
 *
 *   return (
 *     <form action={formAction} method="post">
 *       // inputs named "name", "email", "message"
 *       <button type="submit" disabled={isPending}>Send</button>
 *     </form>
 *   );
 * }
 *```
 *
 * Example: using createFormDataExtractor inside a server action
 * ```ts
 * export async function myAction(prevState, formData: FormData) {
 *   const ex = createFormDataExtractor(formData);
 *   const email = ex.string('email');
 *   const age = ex.optional.number('age');
 *   // ...validate / persist
 * }
 *```
 */

// Helper utilities for form actions and validation

export type FormState<T extends Record<string, unknown> = Record<string, unknown>> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  data?: T;
};

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
 * Create a FormData extractor with type safety and helpful runtime errors.
 *
 * Example:
 * const extractor = createFormDataExtractor(formData);
 * const name = extractor.string('name');
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

/**
 * Create common validation rule factories.
 * Use these with `validateField` to return the first failing message or null.
 */
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

/**
 * Run rules in order and return the first failure message, or null when all pass.
 */
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
// Preset Form Actions
// ============================================================================

/**
 * Simple contact form action used in demos.
 * Expects fields: name, email, message.
 * Returns a FormState with success/error information.
 *
 * Example usage with useActionState:
 * const [state, formAction, isPending] = useActionState(contactFormAction);
 * <form action={formAction}>...</form>
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
 * Small newsletter subscription action used in demos.
 * Expects form field: email
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
