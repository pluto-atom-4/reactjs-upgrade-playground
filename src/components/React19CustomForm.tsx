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
import { FormButton } from './FormButton';
import { FormMessage } from './FormMessage';
import type { FormState } from '../utils/formHelpers';

// ============================================================================
// Types (FormState is defined in src/utils/formHelpers and re-exported below)
// ============================================================================

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
  resetOnSuccess: _resetOnSuccess,
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

