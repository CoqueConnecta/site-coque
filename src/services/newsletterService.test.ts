import { describe, it, expect, vi } from 'vitest';
import { push, ref } from 'firebase/database';
import { subscribeToNewsletter } from './newsletterService';

vi.mock('../../firebase', () => ({ database: {} }));

vi.mock('firebase/database', () => ({
  ref: vi.fn(() => 'newsletter-ref'),
  push: vi.fn().mockResolvedValue(undefined),
  serverTimestamp: vi.fn(() => 'TIMESTAMP'),
}));

describe('subscribeToNewsletter', () => {
  it('pushes the subscription with lgpdConsent and a server timestamp', async () => {
    await subscribeToNewsletter({
      firstName: 'Ana',
      lastName: 'Silva',
      email: 'ana@example.com',
      type: 'donor',
    });

    expect(ref).toHaveBeenCalledWith({}, 'newsletter');
    expect(push).toHaveBeenCalledWith('newsletter-ref', {
      firstName: 'Ana',
      lastName: 'Silva',
      email: 'ana@example.com',
      type: 'donor',
      lgpdConsent: true,
      subscribedAt: 'TIMESTAMP',
    });
  });
});
