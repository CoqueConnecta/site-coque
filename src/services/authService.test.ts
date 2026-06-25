import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'firebase/database';
import { checkIsAdmin } from './authService';

vi.mock('../../firebase', () => ({
  auth: {},
  database: {},
  googleProvider: {},
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  get: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe('checkIsAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false without hitting the database when no email is provided', async () => {
    expect(await checkIsAdmin(null)).toBe(false);
    expect(await checkIsAdmin(undefined)).toBe(false);
    expect(get).not.toHaveBeenCalled();
  });

  it('returns false when the admins node does not exist', async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => false, val: () => null } as never);
    expect(await checkIsAdmin('someone@example.com')).toBe(false);
  });

  it('returns true when the email is in the admin list with isAdmin true', async () => {
    vi.mocked(get).mockResolvedValue({
      exists: () => true,
      val: () => [{ email: 'admin@example.com', isAdmin: true }],
    } as never);
    expect(await checkIsAdmin('admin@example.com')).toBe(true);
  });

  it('returns false when the email is in the list but isAdmin is false', async () => {
    vi.mocked(get).mockResolvedValue({
      exists: () => true,
      val: () => [{ email: 'someone@example.com', isAdmin: false }],
    } as never);
    expect(await checkIsAdmin('someone@example.com')).toBe(false);
  });

  it('returns false when the email is not in the admin list', async () => {
    vi.mocked(get).mockResolvedValue({
      exists: () => true,
      val: () => [{ email: 'admin@example.com', isAdmin: true }],
    } as never);
    expect(await checkIsAdmin('intruder@example.com')).toBe(false);
  });
});
