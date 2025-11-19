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
    fd.append('active', 'true');
    fd.append('empty', '');
    fd.append('whitespace', '   ');

    const ex = createFormDataExtractor(fd);

    expect(ex.string('name')).toBe('Alice');
    expect(ex.number('age')).toBe(30);
    expect(ex.boolean('subscribe')).toBe(true);
    expect(ex.boolean('active')).toBe(true);
    expect(ex.boolean('nonexistent')).toBe(false);
    expect(ex.optional.string('empty')).toBeNull();
    expect(ex.optional.string('whitespace')).toBe('   ');
    expect(ex.optional.number('empty')).toBeNull();
  });

  it('throws when required string field is missing', () => {
    const fd = new FormData();
    const ex = createFormDataExtractor(fd);
    expect(() => ex.string('missing')).toThrow('Missing field: missing');
  });

  it('throws when required number field is missing', () => {
    const fd = new FormData();
    const ex = createFormDataExtractor(fd);
    expect(() => ex.number('missing')).toThrow('Missing field: missing');
  });

  it('throws when number field contains invalid value', () => {
    const fd = new FormData();
    fd.append('invalid', 'not-a-number');
    const ex = createFormDataExtractor(fd);
    expect(() => ex.number('invalid')).toThrow('Invalid number for field: invalid');
  });

  it('handles special number values correctly', () => {
    const fd = new FormData();
    fd.append('zero', '0');
    fd.append('negative', '-42');
    fd.append('float', '3.14');
    fd.append('scientific', '1e10');

    const ex = createFormDataExtractor(fd);

    expect(ex.number('zero')).toBe(0);
    expect(ex.number('negative')).toBe(-42);
    expect(ex.number('float')).toBe(3.14);
    expect(ex.number('scientific')).toBe(1e10);
  });

  it('handles boolean variations correctly', () => {
    const fd = new FormData();
    fd.append('checked1', 'on');
    fd.append('checked2', 'true');
    fd.append('unchecked1', 'false');
    fd.append('unchecked2', '');

    const ex = createFormDataExtractor(fd);

    expect(ex.boolean('checked1')).toBe(true);
    expect(ex.boolean('checked2')).toBe(true);
    expect(ex.boolean('unchecked1')).toBe(false);
    expect(ex.boolean('unchecked2')).toBe(false);
  });
});

describe('validation helpers', () => {
  const rules = createValidationRules();

  describe('required validation', () => {
    it('validates required fields', () => {
      const required = rules.required('Name');
      expect(validateField('', [required])).toBe('Name is required');
      expect(validateField('   ', [required])).toBe('Name is required');
      expect(validateField('John', [required])).toBeNull();
      expect(validateField('  John  ', [required])).toBeNull();
    });
  });

  describe('email validation', () => {
    it('validates email format', () => {
      const email = rules.email();
      expect(validateField('', [email])).toBe('Please enter a valid email address');
      expect(validateField('invalid', [email])).toBe('Please enter a valid email address');
      expect(validateField('test@', [email])).toBe('Please enter a valid email address');
      expect(validateField('@domain.com', [email])).toBe('Please enter a valid email address');
      expect(validateField('test@domain', [email])).toBe('Please enter a valid email address');
      expect(validateField('test@domain.', [email])).toBe('Please enter a valid email address');

      // Valid emails
      expect(validateField('test@domain.com', [email])).toBeNull();
      expect(validateField('user.name@example.co.uk', [email])).toBeNull();
      expect(validateField('user+tag@domain.org', [email])).toBeNull();
    });
  });

  describe('length validations', () => {
    it('validates minimum length', () => {
      const minLength = rules.minLength(5, 'Password');
      expect(validateField('1234', [minLength])).toBe('Password must be at least 5 characters');
      expect(validateField('12345', [minLength])).toBeNull();
      expect(validateField('123456', [minLength])).toBeNull();
    });

    it('validates maximum length', () => {
      const maxLength = rules.maxLength(10, 'Username');
      expect(validateField('short', [maxLength])).toBeNull();
      expect(validateField('exactly10c', [maxLength])).toBeNull();
      expect(validateField('toolongusername', [maxLength])).toBe('Username must be at most 10 characters');
    });
  });

  describe('pattern validation', () => {
    it('validates against custom patterns', () => {
      const phonePattern = rules.pattern(/^\d{3}-\d{3}-\d{4}$/, 'Phone');
      expect(validateField('123-456-7890', [phonePattern])).toBeNull();
      expect(validateField('1234567890', [phonePattern])).toBe('Phone format is invalid');
      expect(validateField('123-45-6789', [phonePattern])).toBe('Phone format is invalid');
    });
  });

  describe('minimum value validation', () => {
    it('validates minimum numeric values', () => {
      const minValue = rules.minValue(18, 'Age');
      expect(validateField('17', [minValue])).toBe('Age must be at least 18');
      expect(validateField('18', [minValue])).toBeNull();
      expect(validateField('25', [minValue])).toBeNull();
      expect(validateField('0', [minValue])).toBe('Age must be at least 18');
    });
  });

  describe('match validation', () => {
    it('validates field matching', () => {
      const password = 'secret123';
      const match = rules.match(password, 'Password Confirmation', 'Password');
      expect(validateField('secret123', [match])).toBeNull();
      expect(validateField('different', [match])).toBe('Password Confirmation must match Password');
      expect(validateField('', [match])).toBe('Password Confirmation must match Password');
    });
  });

  describe('combined validations', () => {
    it('validates multiple rules and returns first failure', () => {
      const emailRules = [
        rules.required('Email'),
        rules.email(),
        rules.maxLength(50, 'Email'),
      ];

      expect(validateField('', emailRules)).toBe('Email is required');
      expect(validateField('invalid-email', emailRules)).toBe('Please enter a valid email address');
      expect(validateField('a'.repeat(40) + '@domain.com', emailRules)).toBe('Email must be at most 50 characters');
      expect(validateField('valid@email.com', emailRules)).toBeNull();
    });

    it('validates password with complex rules', () => {
      const passwordRules = [
        rules.required('Password'),
        rules.minLength(8, 'Password'),
        rules.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password'),
      ];

      expect(validateField('', passwordRules)).toBe('Password is required');
      expect(validateField('short', passwordRules)).toBe('Password must be at least 8 characters');
      expect(validateField('nouppercase123', passwordRules)).toBe('Password format is invalid');
      expect(validateField('NOLOWERCASE123', passwordRules)).toBe('Password format is invalid');
      expect(validateField('NoNumbers', passwordRules)).toBe('Password format is invalid');
      expect(validateField('ValidPassword123', passwordRules)).toBeNull();
    });
  });
});

describe('preset actions', () => {
  describe('contactFormAction', () => {
    it('succeeds with valid data', async () => {
      const fd = new FormData();
      fd.append('name', 'Bob');
      fd.append('email', 'bob@example.com');
      fd.append('message', 'Hello there, this is a longer message');

      const res = await contactFormAction({ success: false }, fd);
      expect(res.success).toBe(true);
      expect(res.message).toContain('Thank you Bob!');
      expect(res.data).toMatchObject({
        name: 'Bob',
        email: 'bob@example.com',
        message: 'Hello there, this is a longer message'
      });
    });

    it('returns validation errors for invalid input', async () => {
      const fd = new FormData();
      fd.append('name', '');
      fd.append('email', 'bobexample.com');
      fd.append('message', 'short');

      const res = await contactFormAction({ success: false }, fd);
      expect(res.success).toBe(false);
      expect(res.message).toBe('Please fix the errors below');
      expect(res.errors).toBeDefined();
      expect(res.errors?.name).toBe('Name is required');
      expect(res.errors?.email).toBe('Invalid email address');
      expect(res.errors?.message).toBe('Message must be at least 10 characters');
    });

    it('handles missing fields gracefully', async () => {
      const fd = new FormData();
      // Missing all fields

      const res = await contactFormAction({ success: false }, fd);
      expect(res.success).toBe(false);
      expect(res.message).toContain('Missing field');
    });

    it('validates individual field requirements', async () => {
      const fd = new FormData();
      fd.append('name', 'John');
      fd.append('email', 'john@example.com');
      fd.append('message', 'Exact 10!!'); // exactly 10 characters

      const res = await contactFormAction({ success: false }, fd);
      expect(res.success).toBe(true);
    });

    it('trims whitespace from name field', async () => {
      const fd = new FormData();
      fd.append('name', '   ');
      fd.append('email', 'test@example.com');
      fd.append('message', 'This is a valid message');

      const res = await contactFormAction({ success: false }, fd);
      expect(res.success).toBe(false);
      expect(res.errors?.name).toBe('Name is required');
    });
  });

  describe('newsletterAction', () => {
    it('succeeds for a valid email', async () => {
      const fd = new FormData();
      fd.append('email', 'test@domain.com');

      const res = await newsletterAction({ success: false }, fd);
      expect(res.success).toBe(true);
      expect(res.message).toContain('You\'ve been subscribed!');
      expect(res.message).toContain('test@domain.com');
      expect(res.data).toMatchObject({ email: 'test@domain.com' });
    });

    it('fails for invalid email', async () => {
      const fd = new FormData();
      fd.append('email', 'not-an-email');

      const res = await newsletterAction({ success: false }, fd);
      expect(res.success).toBe(false);
      expect(res.errors?.email).toBe('Invalid email');
    });

    it('fails for missing email', async () => {
      const fd = new FormData();
      // No email field

      const res = await newsletterAction({ success: false }, fd);
      expect(res.success).toBe(false);
      expect(res.message).toBe('Please enter a valid email address');
    });

    it('fails for empty email', async () => {
      const fd = new FormData();
      fd.append('email', '');

      const res = await newsletterAction({ success: false }, fd);
      expect(res.success).toBe(false);
      expect(res.message).toBe('Please enter a valid email address');
    });

    it('handles various email formats', async () => {
      const validEmails = [
        'user@domain.com',
        'user.name@domain.co.uk',
        'user+tag@subdomain.domain.org',
        'test123@test-domain.com'
      ];

      for (const email of validEmails) {
        const fd = new FormData();
        fd.append('email', email);
        const res = await newsletterAction({ success: false }, fd);
        expect(res.success).toBe(true);
        expect(res.data?.email).toBe(email);
      }
    });
  });
});

