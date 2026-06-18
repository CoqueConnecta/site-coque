import { ref as dbRef, get, set } from 'firebase/database';
import { database } from '../../../../firebase';
import { uploadImageToStorage } from '../../../services/storageService';
import { localImageLibrary } from '../../../data/localImageLibrary';

export async function migrateLocalImagesToStorage(
  onProgress: (done: number, total: number) => void,
): Promise<void> {
  const total = localImageLibrary.length;
  const mapping: Record<string, string> = {};

  for (let i = 0; i < localImageLibrary.length; i++) {
    const asset = localImageLibrary[i];
    const response = await fetch(asset.url);
    const blob = await response.blob();
    const file = new File([blob], asset.name, { type: blob.type || 'image/jpeg' });
    const uploaded = await uploadImageToStorage(file, asset.category, () => {});
    mapping[asset.url] = uploaded.url;
    onProgress(i + 1, total);
  }

  // Replace local paths with Storage URLs in cms/v3
  const cmsRef = dbRef(database, 'cms/v3');
  const snap = await get(cmsRef);
  const cmsData = snap.val();
  if (!cmsData) return;

  const updated = replaceLocalUrls(cmsData, mapping);
  await set(cmsRef, updated);
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
