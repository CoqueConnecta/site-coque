import { describe, it, expect, vi } from 'vitest';
import { get, update, ref } from 'firebase/database';
import { fetchAdminNode, saveAdminFields } from './cmsAdminService';

vi.mock('../../../../firebase', () => ({ database: {} }));

vi.mock('firebase/database', () => ({
  ref: vi.fn((_db, path) => path ?? 'root-ref'),
  get: vi.fn(),
  update: vi.fn().mockResolvedValue(undefined),
}));

describe('fetchAdminNode', () => {
  it('returns an empty object when the node does not exist', async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => false, val: () => null } as never);
    expect(await fetchAdminNode('cms/v3/shared')).toEqual({});
  });

  it('returns the snapshot value when it exists', async () => {
    vi.mocked(get).mockResolvedValue({ exists: () => true, val: () => ({ nav: {} }) } as never);
    expect(await fetchAdminNode('cms/v3/shared')).toEqual({ nav: {} });
  });
});

describe('saveAdminFields', () => {
  it('calls update with the database root ref and the payload', async () => {
    await saveAdminFields({ 'pages/home/hero': { headline: 'x' } });
    expect(ref).toHaveBeenCalledWith({});
    expect(update).toHaveBeenCalledWith('root-ref', { 'pages/home/hero': { headline: 'x' } });
  });
});
