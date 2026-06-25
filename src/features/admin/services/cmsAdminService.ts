import { ref, get, update } from 'firebase/database';
import { database } from '../../../../firebase';

export async function fetchAdminNode(path: string): Promise<Record<string, unknown>> {
  const snapshot = await get(ref(database, path));
  return snapshot.exists() ? (snapshot.val() as Record<string, unknown>) : {};
}

export function saveAdminFields(payload: Record<string, unknown>): Promise<void> {
  return update(ref(database), payload);
}
