import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { describe, it, afterEach, expect } from 'vitest';
import { UseApiPromiseResolverDemo } from './use-api-promise-resolver';

describe('UseApiPromiseResolverDemo', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with title and user selection buttons', () => {
    render(<UseApiPromiseResolverDemo />);

    // Check that the title and description are rendered
    expect(screen.getByText('use() API - Promise Resolver')).toBeInTheDocument();
    expect(screen.getByText(/Unwrap promises within components/i)).toBeInTheDocument();

    // Check that user selection buttons are present
    expect(screen.getByRole('button', { name: /User 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /User 5/i })).toBeInTheDocument();

    // Initial user 1 should be selected
    const user1Button = screen.getByRole('button', { name: /User 1/i });
    expect(user1Button).toHaveClass('bg-teal-600');
  });

  it('displays skeleton loading state initially', () => {
    render(<UseApiPromiseResolverDemo />);

    // Look for the skeleton loading elements by their class (immediate)
    const skeletonDivs = document.querySelectorAll('.animate-pulse');
    expect(skeletonDivs.length).toBeGreaterThan(0);
  });

  it('displays all user buttons for selection', () => {
    render(<UseApiPromiseResolverDemo />);

    // Verify all user selection buttons exist
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('button', { name: new RegExp(`User ${i}`) })).toBeInTheDocument();
    }
  });

  it('displays all explanation concepts', () => {
    render(<UseApiPromiseResolverDemo />);

    // Static content - immediately available
    expect(screen.getByText('How it works:')).toBeInTheDocument();

    // Verify key concept explanations are present
    expect(screen.getByText(/hook allows reading promise values/)).toBeInTheDocument();
    expect(screen.getByText(/Suspense boundary catches it/)).toBeInTheDocument();
    expect(screen.getByText(/Once the promise resolves/)).toBeInTheDocument();
    expect(screen.getByText(/No manual/)).toBeInTheDocument();
  });

  it('has a data display section with labels', () => {
    render(<UseApiPromiseResolverDemo />);

    // Check for the data display section heading
    expect(screen.getByText(/User Data \(Using use\(\) with Suspense\)/)).toBeInTheDocument();

    // The actual data fields will be displayed by the use() hook within Suspense
    // which is tested implicitly through the component rendering without errors
  });

  it('can click user buttons and change active state', async () => {
    const user = userEvent.setup();
    render(<UseApiPromiseResolverDemo />);

    // Initially User 1 is selected
    let user1Button = screen.getByRole('button', { name: /User 1/i });
    expect(user1Button).toHaveClass('bg-teal-600');

    // Click User 3
    const user3Button = screen.getByRole('button', { name: /User 3/i });
    await user.click(user3Button);

    // User 3 should now be selected
    expect(user3Button).toHaveClass('bg-teal-600');

    // User 1 should no longer be selected
    user1Button = screen.getByRole('button', { name: /User 1/i });
    expect(user1Button).not.toHaveClass('bg-teal-600');
  });

  it('displays helper text for user selection', () => {
    render(<UseApiPromiseResolverDemo />);

    expect(screen.getByText(/Select a user to fetch their data/)).toBeInTheDocument();
    expect(screen.getByText(/will unwrap the promise/)).toBeInTheDocument();
  });
});

