import { useActionState, useEffect, useRef } from 'react';
import type { JSX } from 'react';

type DemoStatus = 'idle' | 'pending' | 'success' | 'error';

type AdvancedFormState = {
  status: DemoStatus;
  message?: string;
  errors?: Record<string, string>;
  data?: Record<string, unknown>;
};

type UserFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
};

function validateUserForm(data: UserFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.username || data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (!data.email || !data.email.includes('@')) {
    errors.email = 'Please enter a valid email';
  }

  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  const age = Number.parseInt(data.age);
  if (!data.age || Number.isNaN(age) || age < 18) {
    errors.age = 'You must be at least 18 years old';
  }

  return errors;
}

async function submitAdvancedForm(prevState: AdvancedFormState, formData: FormData): Promise<AdvancedFormState> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const data: UserFormData = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    age: formData.get('age') as string,
  };

  const errors = validateUserForm(data);

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Please fix the errors below',
      errors,
    };
  }

  if (data.username.toLowerCase() === 'admin') {
    return {
      status: 'error',
      message: 'Username already taken',
      errors: { username: 'This username is not available' },
    };
  }

  return {
    status: 'success',
    message: `Welcome ${data.username}! Your account has been created.`,
    data: { username: data.username, email: data.email },
  };
}

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

const FormInput = ({ label, name, type = 'text', placeholder, error, disabled, required }: FormInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
        error ? 'border-red-400 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-blue-500'
      } disabled:bg-gray-100`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export const UseActionStateAdvancedDemo = (): JSX.Element => {
  const [state, formAction, isPending] = useActionState(submitAdvancedForm, { status: 'idle' } as AdvancedFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset();
      const timer = setTimeout(() => undefined, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-blue-900">useActionState - Advanced with Validation</h3>
      <p className="text-sm text-blue-700">Field-level validation, error handling, and form reset on success</p>

      <form ref={formRef} action={formAction} className="space-y-4">
        <FormInput label="Username" name="username" placeholder="Choose a username" error={state.errors?.username} disabled={isPending} required />
        <FormInput label="Email" name="email" type="email" placeholder="your@email.com" error={state.errors?.email} disabled={isPending} required />
        <FormInput label="Password" name="password" type="password" placeholder="At least 8 characters" error={state.errors?.password} disabled={isPending} required />
        <FormInput label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm your password" error={state.errors?.confirmPassword} disabled={isPending} required />
        <FormInput label="Age" name="age" type="number" placeholder="Must be 18 or older" error={state.errors?.age} disabled={isPending} required />

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {state.status === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-semibold">✓ Success!</p>
          <p className="text-sm mt-1">{state.message}</p>
        </div>
      )}

      {state.status === 'error' && !state.errors && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">✗ Error</p>
          <p className="text-sm mt-1">{state.message}</p>
        </div>
      )}

      <div className="bg-blue-100 border border-blue-300 rounded-md p-3 text-sm text-blue-700">
        <strong>Features demonstrated:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Field-level validation with error messages</li>
          <li>Server-side validation simulation</li>
          <li>Form state management and reset</li>
          <li>Loading state with spinner</li>
          <li>Multiple error types handling</li>
        </ul>
      </div>
    </div>
  );
};

