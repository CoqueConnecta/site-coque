import { ref as dbRef, get, set } from 'firebase/database';
import { database } from '../../../../firebase';
import { uploadImageToStorage } from '../../../services/storageService';
import { localImageLibrary } from '../../../data/localImageLibrary';

export async function migrateLocalImagesToStorage(
  onProgress: (done: number, total: number) => void,
): Promise<void> {
  const total = localImageLibrary.length;

  // Build mapping from already-uploaded entries in media/library (idempotency)
  const existingSnap = await get(dbRef(database, 'media/library'));
  const existingEntries = Object.values(existingSnap.val() ?? {}) as Array<{ url: string; name: string }>;
  const mapping: Record<string, string> = {};

  for (const asset of localImageLibrary) {
    const found = existingEntries.find((e) => e.name === asset.name);
    if (found) mapping[asset.url] = found.url;
  }

  // Upload only images not yet in media/library
  const toUpload = localImageLibrary.filter((a) => !mapping[a.url]);
  const alreadyDone = total - toUpload.length;

  for (let i = 0; i < toUpload.length; i++) {
    const asset = toUpload[i];
    const response = await fetch(asset.url);
    const blob = await response.blob();
    const file = new File([blob], asset.name, { type: blob.type || 'image/jpeg' });
    const uploaded = await uploadImageToStorage(file, asset.category, () => {});
    mapping[asset.url] = uploaded.url;
    onProgress(alreadyDone + i + 1, total);
  }

  onProgress(total, total);

  // Update cms/v3/pages and cms/v3/shared separately (rules don't allow writing cms/v3 directly)
  const [pagesSnap, sharedSnap] = await Promise.all([
    get(dbRef(database, 'cms/v3/pages')),
    get(dbRef(database, 'cms/v3/shared')),
  ]);

  await Promise.all([
    pagesSnap.val()
      ? set(dbRef(database, 'cms/v3/pages'), replaceLocalUrls(pagesSnap.val(), mapping))
      : Promise.resolve(),
    sharedSnap.val()
      ? set(dbRef(database, 'cms/v3/shared'), replaceLocalUrls(sharedSnap.val(), mapping))
      : Promise.resolve(),
  ]);
}

function replaceLocalUrls(node: unknown, mapping: Record<string, string>): unknown {
  if (typeof node === 'string') return mapping[node] ?? node;
  if (Array.isArray(node)) return node.map((item) => replaceLocalUrls(item, mapping));
  if (node !== null && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node as Record<string, unknown>).map(([k, v]) => [k, replaceLocalUrls(v, mapping)]),
    );
  }
  return node;
}
