import { afterEach, expect, vi } from 'vitest';
import { cleanup } from '@testing-library/vue';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});

if (typeof window !== 'undefined' && !window.scrollTo) {
  window.scrollTo = vi.fn();
}