import { describe, it, expect } from 'vitest';
import {
  createFormDataExtractor,
  createValidationRules,
  validateField,
  contactFormAction,
  newsletterAction,
} from './formHelpers';

describe('createFormDataExtractor', () => {
  it('extracts string, number, boolean and optional values', () => {
    const fd = new FormData();
    fd.append('name', 'Alice');
    fd.append('age', '30');
    fd.append('subscribe', 'on');
    fd.append('empty', '');

    const ex = createFormDataExtractor(fd);

    expect(ex.string('name')).toBe('Alice');
    expect(ex.number('age')).toBe(30);
    expect(ex.boolean('subscribe')).toBe(true);
    expect(ex.optional.string('empty')).toBeNull();
    expect(ex.optional.number('empty')).toBeNull();
  });

  it('throws when required string field is missing', () => {
    const fd = new FormData();
    const ex = createFormDataExtractor(fd);
    expect(() => ex.string('missing')).toThrow();
  });
});

describe('validation helpers', () => {
  const rules = createValidationRules();

  it('validates required and email and minLength rules', () => {
    expect(validateField('', [rules.required('Name')])).toBe('Name is required');
    expect(validateField('foo', [rules.email()])).toBe('Please enter a valid email address');
    expect(validateField('hello', [rules.minLength(3, 'Field')])).toBeNull();
    expect(validateField('hi', [rules.minLength(3, 'Field')])).toBe('Field must be at least 3 characters');
  });
});

describe('preset actions', () => {
  it('contactFormAction succeeds with valid data', async () => {
    const fd = new FormData();
    fd.append('name', 'Bob');
    fd.append('email', 'bob@example.com');
    fd.append('message', 'Hello there, this is a longer message');

    const res = await contactFormAction({ success: false }, fd as FormData);
    expect(res.success).toBe(true);
    expect(res.data).toMatchObject({ name: 'Bob', email: 'bob@example.com' });
  });

  it('contactFormAction returns validation errors for invalid input', async () => {
    const fd = new FormData();
    fd.append('name', '');
    fd.append('email', 'bobexample.com');
    fd.append('message', 'short');

    const res = await contactFormAction({ success: false }, fd as FormData);
    expect(res.success).toBe(false);
    expect(res.errors).toBeDefined();
    expect(res.errors?.name).toBeDefined();
    expect(res.errors?.email).toBeDefined();
    expect(res.errors?.message).toBeDefined();
  });

  it('newsletterAction succeeds for a valid email', async () => {
    const fd = new FormData();
    fd.append('email', 'test@domain.com');

    const res = await newsletterAction({ success: false }, fd as FormData);
    expect(res.success).toBe(true);
    expect(res.data).toMatchObject({ email: 'test@domain.com' });
  });

  it('newsletterAction fails for invalid email', async () => {
    const fd = new FormData();
    fd.append('email', 'not-an-email');

    const res = await newsletterAction({ success: false }, fd as FormData);
    expect(res.success).toBe(false);
    expect(res.errors?.email).toBe('Invalid email');
  });
});

