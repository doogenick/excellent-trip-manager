// src/setupTests.ts
import { vi } from 'vitest';

if (typeof window !== 'undefined') {
  Element.prototype.scrollIntoView = vi.fn();
}
