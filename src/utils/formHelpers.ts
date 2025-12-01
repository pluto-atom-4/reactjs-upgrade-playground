/**
 * Form Helpers for React 19 Applications
 *
 * A comprehensive collection of utilities for handling forms with React 19's new form features.
 * This module provides type-safe form data extraction, validation helpers, and preset form actions
 * that work seamlessly with React 19's useActionState hook.
 *
 * @fileoverview Utilities for React 19 form handling with type safety and validation
 * @author React 19 Playground
 * @version 1.0.0
 *
 * @example Basic usage with React 19's useActionState
 * ```tsx
 * import { useActionState } from 'react';
 * import { contactFormAction } from '~/utils/formHelpers';
 *
 * export function ContactForm() {
 *   const [state, formAction, isPending] = useActionState(contactFormAction, { success: false });
 *
 *   return (
 *     <form action={formAction}>
 *       <input name="name" placeholder="Your name" required />
 *       <input name="email" type="email" placeholder="Your email" required />
 *       <textarea name="message" placeholder="Your message" required />
 *       <button type="submit" disabled={isPending}>
 *         {isPending ? 'Sending...' : 'Send Message'}
 *       </button>
 *       {state.message && <p>{state.message}</p>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example Creating custom form actions
 * ```tsx
 * import { createFormDataExtractor, createValidationRules, validateField } from '~/utils/formHelpers';
 *
 * export async function signupAction(prevState: FormState, formData: FormData): Promise<FormState> {
 *   try {
 *     const ex = createFormDataExtractor(formData);
 *     const rules = createValidationRules();
 *
 *     // Extract form data
 *     const email = ex.string('email');
 *     const password = ex.string('password');
 *     const confirmPassword = ex.string('confirmPassword');
 *
 *     // Validate fields
 *     const errors: Record<string, string> = {};
 *
 *     const emailError = validateField(email, [
 *       rules.required('Email'),
 *       rules.email(),
 *       rules.maxLength(100, 'Email')
 *     ]);
 *     if (emailError) errors.email = emailError;
 *
 *     const passwordError = validateField(password, [
 *       rules.required('Password'),
 *       rules.minLength(8, 'Password'),
 *       rules.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password')
 *     ]);
 *     if (passwordError) errors.password = passwordError;
 *
 *     const confirmError = validateField(confirmPassword, [
 *       rules.match(password, 'Password Confirmation', 'Password')
 *     ]);
 *     if (confirmError) errors.confirmPassword = confirmError;
 *
 *     if (Object.keys(errors).length > 0) {
 *       return { success: false, message: 'Please fix the errors below', errors };
 *     }
 *
 *     // Process signup
 *     await createUser({ email, password });
 *
 *     return {
 *       success: true,
 *       message: 'Account created successfully!',
 *       data: { email }
 *     };
 *   } catch (error) {
 *     return {
 *       success: false,
 *       message: error instanceof Error ? error.message : 'Signup failed'
 *     };
 *   }
 * }
 * ```
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Standard form state shape for React 19 form actions.
 *
 * @template T - The type of the success data payload
 *
 * @example
 * ```ts
 * type ContactFormData = {
 *   name: string;
 *   email: string;
 *   message: string;
 * };
 *
 * const state: FormState<ContactFormData> = {
 *   success: true,
 *   message: 'Thank you for your message!',
 *   data: { name: 'John', email: 'john@example.com', message: 'Hello!' }
 * };
 * ```
 */
export type FormState<T extends Record<string, unknown> = Record<string, unknown>> = {
  /** Whether the form submission was successful */
  success: boolean;
  /** General message to display to the user */
  message?: string;
  /** Field-specific validation errors (key = field name, value = error message) */
  errors?: Record<string, string>;
  /** Success data payload when submission succeeds */
  data?: T;
};

/**
 * Type-safe FormData extractor interface.
 * Provides methods to extract and convert form field values with runtime validation.
 *
 * @example
 * ```ts
 * const formData = new FormData();
 * formData.append('name', 'John Doe');
 * formData.append('age', '25');
 * formData.append('newsletter', 'on');
 *
 * const ex = createFormDataExtractor(formData);
 * const name = ex.string('name');           // 'John Doe'
 * const age = ex.number('age');             // 25
 * const newsletter = ex.boolean('newsletter'); // true
 * const phone = ex.optional.string('phone'); // null (field not present)
 * ```
 */
export type FormDataExtractor = {
  /** Extract a required string field. Throws if missing or not a string. */
  string: (name: string) => string;
  /** Extract a required number field. Throws if missing, not a string, or not a valid number. */
  number: (name: string) => number;
  /** Extract a boolean field. Returns true for 'on' or 'true', false otherwise. */
  boolean: (name: string) => boolean;
  /** Optional field extractors that return null instead of throwing */
  optional: {
    /** Extract an optional string field. Returns null if missing or empty. */
    string: (name: string) => string | null;
    /** Extract an optional number field. Returns null if missing, empty, or not a valid number. */
    number: (name: string) => number | null;
  };
};

// ============================================================================
// Form Data Extraction
// ============================================================================

/**
 * Create a type-safe FormData extractor with helpful runtime validation.
 *
 * Provides a fluent API for extracting form field values with automatic type conversion
 * and clear error messages when fields are missing or invalid.
 *
 * @param formData - The FormData object to extract values from
 * @returns FormDataExtractor interface with extraction methods
 *
 * @example Required fields
 * ```ts
 * const formData = new FormData();
 * formData.append('email', 'user@example.com');
 * formData.append('age', '25');
 * formData.append('subscribe', 'on');
 *
 * const ex = createFormDataExtractor(formData);
 *
 * const email = ex.string('email');     // 'user@example.com'
 * const age = ex.number('age');         // 25
 * const subscribe = ex.boolean('subscribe'); // true
 *
 * // These would throw:
 * // ex.string('missing');  // throws "Missing field: missing"
 * // ex.number('email');    // throws "Invalid number for field: email"
 * ```
 *
 * @example Optional fields
 * ```ts
 * const ex = createFormDataExtractor(formData);
 *
 * const phone = ex.optional.string('phone');     // null if missing/empty
 * const score = ex.optional.number('score');     // null if missing/invalid
 * const notes = ex.optional.string('notes');     // null if empty string
 * ```
 *
 * @example Error handling
 * ```ts
 * try {
 *   const ex = createFormDataExtractor(formData);
 *   const requiredField = ex.string('required');
 * } catch (error) {
 *   console.error(error.message); // "Missing field: required"
 * }
 * ```
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
// Validation System
// ============================================================================

/**
 * A validation rule that can be applied to form field values.
 *
 * @example
 * ```ts
 * const emailRule: ValidationRule = {
 *   validate: (value) => /\S+@\S+\.\S+/.test(value),
 *   message: 'Please enter a valid email address'
 * };
 *
 * const error = emailRule.validate('invalid') ? null : emailRule.message;
 * ```
 */
export type ValidationRule = {
  /** Function that returns true if the value is valid */
  validate: (value: string) => boolean;
  /** Error message to display when validation fails */
  message: string;
};

/**
 * Create a collection of common validation rule factories.
 *
 * These factories return ValidationRule objects that can be used with the validateField function
 * to provide comprehensive form validation with clear error messages.
 *
 * @returns Object containing validation rule factory functions
 *
 * @example Basic field validation
 * ```ts
 * const rules = createValidationRules();
 * const nameRules = [rules.required('Name'), rules.minLength(2, 'Name')];
 * const nameError = validateField(userInput, nameRules);
 * if (nameError) {
 *   console.log(nameError); // "Name is required" or "Name must be at least 2 characters"
 * }
 * ```
 *
 * @example Email validation
 * ```ts
 * const rules = createValidationRules();
 * const emailRules = [
 *   rules.required('Email'),
 *   rules.email(),
 *   rules.maxLength(100, 'Email')
 * ];
 * const emailError = validateField(email, emailRules);
 * ```
 *
 * @example Password validation with complex requirements
 * ```ts
 * const rules = createValidationRules();
 * const passwordRules = [
 *   rules.required('Password'),
 *   rules.minLength(8, 'Password'),
 *   rules.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Password must contain uppercase, lowercase, number, and special character')
 * ];
 * const passwordError = validateField(password, passwordRules);
 * ```
 *
 * @example Confirmation field validation
 * ```ts
 * const rules = createValidationRules();
 * const confirmRules = [
 *   rules.required('Password Confirmation'),
 *   rules.match(originalPassword, 'Password Confirmation', 'Password')
 * ];
 * const confirmError = validateField(confirmPassword, confirmRules);
 * ```
 */
export function createValidationRules() {
  return {
    /**
     * Creates a validation rule that requires a non-empty value (after trimming whitespace).
     *
     * @param fieldName - Display name of the field for error messages
     * @returns ValidationRule that checks for required values
     *
     * @example
     * ```ts
     * const required = rules.required('Username');
     * validateField('', [required]);        // "Username is required"
     * validateField('   ', [required]);     // "Username is required"
     * validateField('john', [required]);    // null (valid)
     * ```
     */
    required: (fieldName: string): ValidationRule => ({
      validate: (value: string) => value.trim().length > 0,
      message: `${fieldName} is required`,
    }),

    /**
     * Creates a validation rule for basic email format validation.
     * Uses a simple regex pattern that covers most common email formats.
     *
     * @returns ValidationRule that checks for valid email format
     *
     * @example
     * ```ts
     * const email = rules.email();
     * validateField('invalid', [email]);           // "Please enter a valid email address"
     * validateField('user@domain.com', [email]);   // null (valid)
     * validateField('user+tag@sub.domain.co.uk', [email]); // null (valid)
     * ```
     */
    email: (): ValidationRule => ({
      validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address',
    }),

    /**
     * Creates a validation rule for minimum string length.
     *
     * @param length - Minimum required length
     * @param fieldName - Display name of the field for error messages
     * @returns ValidationRule that checks minimum length
     *
     * @example
     * ```ts
     * const minLength = rules.minLength(8, 'Password');
     * validateField('short', [minLength]);     // "Password must be at least 8 characters"
     * validateField('longenough', [minLength]); // null (valid)
     * ```
     */
    minLength: (length: number, fieldName: string): ValidationRule => ({
      validate: (value: string) => value.length >= length,
      message: `${fieldName} must be at least ${length} characters`,
    }),

    /**
     * Creates a validation rule for maximum string length.
     *
     * @param length - Maximum allowed length
     * @param fieldName - Display name of the field for error messages
     * @returns ValidationRule that checks maximum length
     *
     * @example
     * ```ts
     * const maxLength = rules.maxLength(50, 'Bio');
     * validateField('x'.repeat(51), [maxLength]); // "Bio must be at most 50 characters"
     * validateField('Just right', [maxLength]);   // null (valid)
     * ```
     */
    maxLength: (length: number, fieldName: string): ValidationRule => ({
      validate: (value: string) => value.length <= length,
      message: `${fieldName} must be at most ${length} characters`,
    }),

    /**
     * Creates a validation rule for custom regex pattern matching.
     *
     * @param pattern - Regular expression to test against
     * @param fieldName - Display name of the field for error messages
     * @returns ValidationRule that checks pattern matching
     *
     * @example
     * ```ts
     * // Phone number validation
     * const phone = rules.pattern(/^\d{3}-\d{3}-\d{4}$/, 'Phone Number');
     * validateField('555-123-4567', [phone]); // null (valid)
     * validateField('5551234567', [phone]);   // "Phone Number format is invalid"
     *
     * // Strong password validation
     * const strongPassword = rules.pattern(
     *   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
     *   'Password must contain uppercase, lowercase, number, and special character'
     * );
     * ```
     */
    pattern: (pattern: RegExp, fieldName: string): ValidationRule => ({
      validate: (value: string) => pattern.test(value),
      message: `${fieldName} format is invalid`,
    }),

    /**
     * Creates a validation rule for minimum numeric values.
     * Converts the string value to a number before comparison.
     *
     * @param min - Minimum allowed value
     * @param fieldName - Display name of the field for error messages
     * @returns ValidationRule that checks minimum value
     *
     * @example
     * ```ts
     * const minAge = rules.minValue(18, 'Age');
     * validateField('17', [minAge]); // "Age must be at least 18"
     * validateField('21', [minAge]); // null (valid)
     * validateField('25.5', [minAge]); // null (valid, decimals work)
     * ```
     */
    minValue: (min: number, fieldName: string): ValidationRule => ({
      validate: (value: string) => Number(value) >= min,
      message: `${fieldName} must be at least ${min}`,
    }),

    /**
     * Creates a validation rule that ensures a field matches another value.
     * Commonly used for password confirmation fields.
     *
     * @param otherValue - The value to match against
     * @param fieldName - Display name of the field being validated
     * @param otherFieldName - Display name of the field being matched
     * @returns ValidationRule that checks field matching
     *
     * @example
     * ```ts
     * const password = 'mySecretPassword';
     * const confirmMatch = rules.match(password, 'Password Confirmation', 'Password');
     * validateField('mySecretPassword', [confirmMatch]); // null (valid)
     * validateField('differentPassword', [confirmMatch]); // "Password Confirmation must match Password"
     *
     * // In a form action:
     * const password = ex.string('password');
     * const confirmPassword = ex.string('confirmPassword');
     * const confirmError = validateField(confirmPassword, [
     *   rules.required('Password Confirmation'),
     *   rules.match(password, 'Password Confirmation', 'Password')
     * ]);
     * ```
     */
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
 * Validates a field value against an array of validation rules.
 *
 * Runs validation rules in order and returns the first failure message encountered,
 * or null if all rules pass. This allows for fail-fast validation with clear,
 * specific error messages.
 *
 * @param value - The string value to validate
 * @param rules - Array of ValidationRule objects to apply
 * @returns First validation error message, or null if all rules pass
 *
 * @example Single rule validation
 * ```ts
 * const rules = createValidationRules();
 * const error = validateField('', [rules.required('Name')]);
 * console.log(error); // "Name is required"
 * ```
 *
 * @example Multiple rules (fail-fast behavior)
 * ```ts
 * const rules = createValidationRules();
 * const emailRules = [
 *   rules.required('Email'),    // Checked first
 *   rules.email(),              // Checked second (if first passes)
 *   rules.maxLength(50, 'Email') // Checked third (if first two pass)
 * ];
 *
 * validateField('', emailRules);           // "Email is required" (stops here)
 * validateField('invalid', emailRules);    // "Please enter a valid email address"
 * validateField('valid@example.com', emailRules); // null (all pass)
 * ```
 *
 * @example Complex validation in form actions
 * ```ts
 * export async function registerAction(prevState: FormState, formData: FormData) {
 *   const ex = createFormDataExtractor(formData);
 *   const rules = createValidationRules();
 *
 *   const email = ex.string('email');
 *   const password = ex.string('password');
 *   const confirmPassword = ex.string('confirmPassword');
 *
 *   const errors: Record<string, string> = {};
 *
 *   // Validate each field
 *   const emailError = validateField(email, [
 *     rules.required('Email'),
 *     rules.email(),
 *     rules.maxLength(100, 'Email')
 *   ]);
 *   if (emailError) errors.email = emailError;
 *
 *   const passwordError = validateField(password, [
 *     rules.required('Password'),
 *     rules.minLength(8, 'Password'),
 *     rules.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password')
 *   ]);
 *   if (passwordError) errors.password = passwordError;
 *
 *   // Only validate confirmation if password is valid
 *   if (!passwordError) {
 *     const confirmError = validateField(confirmPassword, [
 *       rules.required('Password Confirmation'),
 *       rules.match(password, 'Password Confirmation', 'Password')
 *     ]);
 *     if (confirmError) errors.confirmPassword = confirmError;
 *   }
 *
 *   if (Object.keys(errors).length > 0) {
 *     return { success: false, message: 'Please fix the errors below', errors };
 *   }
 *
 *   // Continue with registration...
 * }
 * ```
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
 * Ready-to-use contact form action for React 19 applications.
 *
 * Handles a standard contact form with name, email, and message fields.
 * Includes built-in validation, error handling, and simulated processing time.
 * Perfect for demos and getting started quickly.
 *
 * **Expected Form Fields:**
 * - `name` (string, required): Contact's full name
 * - `email` (string, required): Valid email address
 * - `message` (string, required): Message content (minimum 10 characters)
 *
 * **Validation Rules:**
 * - Name: Required, trimmed whitespace
 * - Email: Required, basic email format validation
 * - Message: Required, minimum 10 characters
 *
 * @param prevState - Previous form state (typically ignored in implementation)
 * @param formData - Form data containing name, email, and message fields
 * @returns Promise resolving to FormState with success/error information
 *
 * @example Basic usage with useActionState
 * ```tsx
 * import { useActionState } from 'react';
 * import { contactFormAction } from '~/utils/formHelpers';
 *
 * export function ContactForm() {
 *   const [state, formAction, isPending] = useActionState(contactFormAction, { success: false });
 *
 *   return (
 *     <div>
 *       <form action={formAction}>
 *         <input
 *           name="name"
 *           placeholder="Your full name"
 *           required
 *           disabled={isPending}
 *         />
 *         <input
 *           name="email"
 *           type="email"
 *           placeholder="your@email.com"
 *           required
 *           disabled={isPending}
 *         />
 *         <textarea
 *           name="message"
 *           placeholder="Your message (at least 10 characters)"
 *           required
 *           disabled={isPending}
 *         />
 *         <button type="submit" disabled={isPending}>
 *           {isPending ? 'Sending...' : 'Send Message'}
 *         </button>
 *       </form>
 *
 *       {state.success && state.message && (
 *         <div className="success">{state.message}</div>
 *       )}
 *
 *       {!state.success && state.message && (
 *         <div className="error">{state.message}</div>
 *       )}
 *
 *       {state.errors && Object.entries(state.errors).map(([field, error]) => (
 *         <div key={field} className="field-error">
 *           {field}: {error}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Custom form wrapper
 * ```tsx
 * import { CustomForm } from '~/components/React19CustomForm';
 * import { contactFormAction } from '~/utils/formHelpers';
 *
 * export function MyContactForm() {
 *   return (
 *     <CustomForm
 *       action={contactFormAction}
 *       onSuccess={(data) => console.log('Contact submitted:', data)}
 *       submitButtonText="Send Message"
 *       pendingButtonText="Sending..."
 *     >
 *       <input name="name" placeholder="Your name" required />
 *       <input name="email" type="email" placeholder="Your email" required />
 *       <textarea name="message" placeholder="Your message" required />
 *     </CustomForm>
 *   );
 * }
 * ```
 *
 * **Return Value Examples:**
 *
 * Success:
 * ```ts
 * {
 *   success: true,
 *   message: "Thank you John! We received your message and will reply soon.",
 *   data: { name: "John Doe", email: "john@example.com", message: "Hello there!" }
 * }
 * ```
 *
 * Validation Errors:
 * ```ts
 * {
 *   success: false,
 *   message: "Please fix the errors below",
 *   errors: {
 *     name: "Name is required",
 *     email: "Invalid email address",
 *     message: "Message must be at least 10 characters"
 *   }
 * }
 * ```
 *
 * Processing Error:
 * ```ts
 * {
 *   success: false,
 *   message: "An error occurred"
 * }
 * ```
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
 * Simple newsletter subscription action for React 19 applications.
 *
 * Handles email subscription forms with basic email validation.
 * Perfect for newsletter signups, waitlists, and simple lead capture forms.
 *
 * **Expected Form Fields:**
 * - `email` (string, required): Valid email address
 *
 * **Validation Rules:**
 * - Email: Required, basic format validation (contains @ symbol)
 *
 * @param prevState - Previous form state (typically ignored in implementation)
 * @param formData - Form data containing email field
 * @returns Promise resolving to FormState with success/error information
 *
 * @example Newsletter subscription form
 * ```tsx
 * import { useActionState } from 'react';
 * import { newsletterAction } from '~/utils/formHelpers';
 *
 * export function NewsletterForm() {
 *   const [state, formAction, isPending] = useActionState(newsletterAction, { success: false });
 *
 *   return (
 *     <form action={formAction} className="newsletter-form">
 *       <div>
 *         <input
 *           name="email"
 *           type="email"
 *           placeholder="Enter your email"
 *           required
 *           disabled={isPending}
 *         />
 *         <button type="submit" disabled={isPending}>
 *           {isPending ? 'Subscribing...' : 'Subscribe'}
 *         </button>
 *       </div>
 *
 *       {state.message && (
 *         <p className={state.success ? 'success' : 'error'}>
 *           {state.message}
 *         </p>
 *       )}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example Inline subscription with custom styling
 * ```tsx
 * export function InlineSubscription() {
 *   const [state, formAction, isPending] = useActionState(newsletterAction, { success: false });
 *
 *   if (state.success) {
 *     return (
 *       <div className="subscription-success">
 *         ✅ Thanks for subscribing! Check your email for confirmation.
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <form action={formAction} className="inline-form">
 *       <input name="email" type="email" placeholder="your@email.com" />
 *       <button disabled={isPending}>
 *         {isPending ? '...' : 'Join'}
 *       </button>
 *       {state.message && !state.success && (
 *         <span className="error">{state.message}</span>
 *       )}
 *     </form>
 *   );
 * }
 * ```
 *
 * **Return Value Examples:**
 *
 * Success:
 * ```ts
 * {
 *   success: true,
 *   message: "You've been subscribed! Check user@example.com for confirmation.",
 *   data: { email: "user@example.com" }
 * }
 * ```
 *
 * Invalid Email:
 * ```ts
 * {
 *   success: false,
 *   message: "Please enter a valid email address",
 *   errors: { email: "Invalid email" }
 * }
 * ```
 *
 * Processing Error:
 * ```ts
 * {
 *   success: false,
 *   message: "Failed to subscribe. Please try again."
 * }
 * ```
 */
export async function newsletterAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const email = formData.get('email') as string;

    if (!email?.includes('@')) {
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
  } catch (_error) {
    return {
      success: false,
      message: 'Failed to subscribe. Please try again.',
    };
  }
}
