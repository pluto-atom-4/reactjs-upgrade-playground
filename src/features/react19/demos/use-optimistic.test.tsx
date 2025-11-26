import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { describe, it, afterEach, expect } from 'vitest';
import { UseOptimisticDemo } from './use-optimistic';

describe('UseOptimisticDemo handleAddTodo', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows optimistic pending item immediately and confirms after server delay', async () => {
    const user = userEvent.setup();
    render(<UseOptimisticDemo />);

    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /add/i });

    // Type the todo text using userEvent
    await user.type(input, 'Test todo');

    // Click the Add button
    await user.click(button);

    // Optimistic update appears immediately with flexible text matching
    await waitFor(
      () => {
        const todoItems = screen.getAllByRole('listitem');
        const hasTestTodo = todoItems.some((item) => item.textContent?.includes('Test todo'));
        expect(hasTestTodo).toBe(true);
      },
      { timeout: 1000 }
    );

    // Verify pending indicator appears (yellow background + pending... text)
    await waitFor(
      () => {
        const pendingItems = screen.queryAllByText((content) => content.includes('pending'));
        expect(pendingItems.length).toBeGreaterThan(0);
      },
      { timeout: 1000 }
    );

    // Wait for pending state removal (2000ms server delay + buffer)
    await waitFor(
      () => {
        const stillPending = screen.queryAllByText((content) => content.includes('pending'));
        expect(stillPending.length).toBe(0);
      },
      { timeout: 5000 }
    );

    // Verify final confirmed item exists and no longer has pending indicator
    await waitFor(() => {
      const todoItems = screen.getAllByRole('listitem');
      const confirmedItem = todoItems.some(
        (item) => item.textContent?.includes('Test todo') && !item.textContent?.includes('pending')
      );
      expect(confirmedItem).toBe(true);
    });
  }, 12000);
});