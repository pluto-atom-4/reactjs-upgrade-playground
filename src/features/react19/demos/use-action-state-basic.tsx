import { useActionState } from 'react';
import type { JSX } from 'react';

type FormState = {
  status: 'idle' | 'pending' | 'success' | 'error';
  message?: string;
  data?: Record<string, unknown>;
};

async function submitForm(prevState: FormState, formData: FormData): Promise<FormState> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (!name || !email) {
    return {
      status: 'error',
      message: 'Name and email are required',
    };
  }

  return {
    status: 'success',
    message: `Successfully submitted! Hello ${name}`,
    data: { name, email },
  };
}

export const UseActionStateDemo = (): JSX.Element => {
  const [state, formAction, isPending] = useActionState(submitForm, { status: 'idle' } as FormState);

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-blue-900">useActionState Hook - Basic</h3>
      <p className="text-sm text-blue-700">Handles form submission with optimistic UI updates</p>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {state.status === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">✓ {state.message}</div>
      )}

      {state.status === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">✗ {state.message}</div>
      )}
    </div>
  );
};

