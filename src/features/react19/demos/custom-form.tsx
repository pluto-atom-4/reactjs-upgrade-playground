import { contactFormAction, newsletterAction } from '~/utils/formHelpers';
import { CustomForm } from '~/components/React19CustomForm';
import { FormInput } from '~/components/FormInput';

export function CustomFormDemo() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Custom Form Component</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Reusable form wrapper with React 19's useActionState, built-in validation,
          error handling, and loading states. Demonstrates form composition patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form Demo */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Contact Form Example</h3>
          <p className="text-gray-400 text-sm mb-4">
            Uses the preset contactFormAction with validation for name, email, and message fields.
          </p>
          <CustomForm
            action={contactFormAction}
            submitButtonText="Send Message"
            pendingButtonText="Sending..."
            containerClassName="space-y-4"
            formClassName="space-y-4"
          >
            <FormInput
              label="Name"
              name="name"
              placeholder="Your full name"
              required
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
            />
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Your message (at least 10 characters)"
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </CustomForm>
        </div>

        {/* Newsletter Form Demo */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Newsletter Signup</h3>
          <p className="text-gray-400 text-sm mb-4">
            Simple newsletter subscription using the preset newsletterAction.
          </p>
          <CustomForm
            action={newsletterAction}
            submitButtonText="Subscribe"
            pendingButtonText="Subscribing..."
            containerClassName="space-y-4"
            formClassName="space-y-4"
          >
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              helper="We'll never share your email with anyone else."
              required
            />
          </CustomForm>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Usage Examples</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-lg text-blue-300 mb-2">Basic Usage</h4>
            <pre className="bg-black rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
{`import { CustomForm } from '~/components/React19CustomForm';
import { contactFormAction } from '~/utils/formHelpers';

<CustomForm
  action={contactFormAction}
  submitButtonText="Send"
  pendingButtonText="Sending..."
>
  <FormInput name="name" label="Name" required />
  <FormInput name="email" label="Email" type="email" required />
</CustomForm>`}
            </pre>
          </div>
          <div>
            <h4 className="text-lg text-blue-300 mb-2">Key Features</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Built-in integration with React 19's useActionState hook</li>
              <li>Automatic form submission handling and pending states</li>
              <li>Error message display for both general and field-specific errors</li>
              <li>Success message handling with optional callback</li>
              <li>Disabled fieldset during submission for better UX</li>
              <li>Customizable styling via className props</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
