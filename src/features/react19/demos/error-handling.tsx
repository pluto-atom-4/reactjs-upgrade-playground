'use client';

import React, { useActionState, useState } from 'react';
import type { JSX } from 'react';

type SubmissionState = {
  status: 'idle' | 'pending' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
  globalError?: string;
};

type ValidationErrorsState = {
  name?: string;
  email?: string;
  age?: string;
};

// Simulate server-side action with error handling
async function handleSubmitWithValidation(
  _prevState: SubmissionState,
  formData: FormData
): Promise<SubmissionState> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const age = formData.get('age') as string;

  // Validation errors
  const errors: ValidationErrorsState = {};

  if (name?.trim().length === 0) {
    errors.name = 'Name is required';
  }

  if (email?.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!email.includes('@')) {
    errors.email = 'Invalid email format';
  }

  if (age?.trim().length === 0) {
    errors.age = 'Age is required';
  } else {
    const ageNum = parseInt(age, 10);
    if (Number.isNaN(ageNum) || ageNum < 18) {
      errors.age = 'Must be 18 or older';
    }
  }

  // Return field errors if validation failed
  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      fieldErrors: errors,
      message: 'Please fix the validation errors',
    };
  }

  // Simulate server error scenario
  if (email.includes('error')) {
    return {
      status: 'error',
      globalError: 'Server error: Email address is already in use',
      message: 'Failed to submit form',
    };
  }

  return {
    status: 'success',
    message: `Welcome ${name}! Your submission was successful.`,
  };
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <h4 className="font-bold text-red-900 mb-2">Something went wrong</h4>
          <p className="text-sm text-red-700">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorHandlingDemo = (): JSX.Element => {
  const [state, formAction, isPending] = useActionState(
    handleSubmitWithValidation,
    { status: 'idle' } as SubmissionState
  );
  const [showManualError, setShowManualError] = useState(false);

  const hasFieldErrors = state.fieldErrors && Object.keys(state.fieldErrors).length > 0;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Form with Error Handling */}
        <div className="bg-gradient-to-br from-red-50 to-red-50/50 border-2 border-red-200 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-red-900 mb-2">Error Handling in React 19</h3>
          <p className="text-sm text-red-700 mb-6">
            Demonstrates validation errors, field-level errors, and global error states with useActionState
          </p>

          <form action={formAction} className="space-y-4">
            {/* Global Error Message */}
            {state.globalError && (
              <div className="bg-red-100 border border-red-400 rounded p-3">
                <p className="text-sm text-red-800 font-semibold">⚠️ {state.globalError}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name {state.fieldErrors?.name && <span className="text-red-600">*</span>}
              </label>
              <input
                type="text"
                name="name"
                disabled={isPending}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
                  state.fieldErrors?.name
                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-red-500'
                } disabled:bg-gray-100`}
                placeholder="Enter your full name"
                aria-invalid={!!state.fieldErrors?.name}
                aria-describedby={state.fieldErrors?.name ? 'name-error' : undefined}
              />
              {state.fieldErrors?.name && (
                <p id="name-error" className="text-sm text-red-600 mt-1">
                  {state.fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email {state.fieldErrors?.email && <span className="text-red-600">*</span>}
              </label>
              <input
                type="email"
                name="email"
                disabled={isPending}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
                  state.fieldErrors?.email
                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-red-500'
                } disabled:bg-gray-100`}
                placeholder="Enter your email (or use 'error' to test)"
                aria-invalid={!!state.fieldErrors?.email}
                aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
              />
              {state.fieldErrors?.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1">
                  {state.fieldErrors.email}
                </p>
              )}
            </div>

            {/* Age Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age {state.fieldErrors?.age && <span className="text-red-600">*</span>}
              </label>
              <input
                type="number"
                name="age"
                disabled={isPending}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
                  state.fieldErrors?.age
                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-red-500'
                } disabled:bg-gray-100`}
                placeholder="Enter your age"
                aria-invalid={!!state.fieldErrors?.age}
                aria-describedby={state.fieldErrors?.age ? 'age-error' : undefined}
              />
              {state.fieldErrors?.age && (
                <p id="age-error" className="text-sm text-red-600 mt-1">
                  {state.fieldErrors.age}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:bg-red-400 transition"
            >
              {isPending ? 'Submitting...' : 'Submit Form'}
            </button>
          </form>

          {/* Success Message */}
          {state.status === 'success' && (
            <div className="mt-4 bg-green-100 border border-green-400 rounded-lg p-4">
              <p className="text-green-800 font-semibold">✓ {state.message}</p>
            </div>
          )}

          {/* Summary of Validation Errors */}
          {hasFieldErrors && state.status !== 'success' && (
            <div className="mt-4 bg-red-100 border border-red-300 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">Validation Errors:</h4>
              <ul className="space-y-1">
                {Object.entries(state.fieldErrors ?? {}).map(([field, error]) => (
                  <li key={field} className="text-sm text-red-700">
                    • {field}: {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Manual Error Simulation */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-50/50 border-2 border-orange-200 rounded-lg p-6">
          <h4 className="text-lg font-bold text-orange-900 mb-3">Error Boundary Demo</h4>
          <p className="text-sm text-orange-700 mb-4">
            Demonstrates React Error Boundary component for catching rendering errors
          </p>

          <button
            onClick={() => setShowManualError(!showManualError)}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition font-medium"
          >
            {showManualError ? 'Hide Error' : 'Trigger Error'}
          </button>

          {showManualError && (
            <div className="mt-4">
              <ThrowError />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h4 className="font-bold text-blue-900 mb-3">React 19 Error Handling Features</h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>useActionState:</strong> Automatically handles pending, success, and error states
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Field-level Errors:</strong> Track validation errors per field with proper aria attributes
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Global Error States:</strong> Handle server-side errors and business logic failures
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Error Boundaries:</strong> Catch rendering errors with getDerivedStateFromError
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Accessible Errors:</strong> Use aria-invalid and aria-describedby for screen readers
              </span>
            </li>
          </ul>
        </div>

        {/* Test Scenarios */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <h4 className="font-bold text-purple-900 mb-3">Test Scenarios</h4>
          <ul className="space-y-2 text-sm text-purple-700">
            <li>
              <strong>Validation:</strong> Leave fields empty or enter invalid data
            </li>
            <li>
              <strong>Server Error:</strong> Enter "error@example.com" to trigger server error
            </li>
            <li>
              <strong>Success:</strong> Fill all fields with valid data (name, valid email, age 18+)
            </li>
            <li>
              <strong>Error Boundary:</strong> Click "Trigger Error" button to see error boundary in action
            </li>
          </ul>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Component that throws an error for boundary testing
function ThrowError(): JSX.Element {
  throw new Error('Intentional error for testing Error Boundary!');
}

