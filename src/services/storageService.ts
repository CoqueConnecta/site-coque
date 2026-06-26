import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, push, set, onValue, remove, type Unsubscribe } from 'firebase/database';
import { storage, database } from '../../firebase';
import type { MediaAsset } from '../features/admin/types';

export function uploadImageToStorage(
  file: File,
  category: string,
  onProgress: (pct: number) => void,
): Promise<MediaAsset> {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const safeCategory = category || 'gallery';
    const path = `images/${safeCategory}/${timestamp}-${file.name}`;
    const fileRef = storageRef(storage, path);
    const task = uploadBytesResumable(fileRef, file);

    task.on(
      'state_changed',
      (snap) => {
        onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          const newRef = push(dbRef(database, 'media/library'));
          const id = newRef.key!;
          const asset: MediaAsset = { id, url, name: file.name, title: '', alt: '', category: safeCategory };
          await set(newRef, { url, name: file.name, title: '', alt: '', category: safeCategory, uploadedAt: timestamp });
          resolve(asset);
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}

export function subscribeToMediaLibrary(callback: (assets: MediaAsset[]) => void): Unsubscribe {
  return onValue(dbRef(database, 'media/library'), (snapshot) => {
    const data = (snapshot.val() ?? {}) as Record<string, Omit<MediaAsset, 'id'>>;
    const assets: MediaAsset[] = Object.entries(data).map(([id, val]) => ({ id, ...val }));
    callback(assets);
  });
}

export async function deleteImageFromStorage(id: string, url: string): Promise<void> {
  // 1. Delete database record
  await remove(dbRef(database, `media/library/${id}`));

  // 2. Delete storage object
  try {
    const fileRef = storageRef(storage, url);
    await deleteObject(fileRef);
  } catch (err) {
    console.error('[storageService] Failed to delete file from Storage:', err);
  }
}

export function subscribeToMediaCategories(
  callback: (categories: Record<string, { label: string }>) => void,
): Unsubscribe {
  return onValue(dbRef(database, 'media/categories'), (snapshot) => {
    const data = (snapshot.val() ?? {}) as Record<string, { label: string }>;
    callback(data);
  });
}

export async function createMediaCategory(id: string, label: string): Promise<void> {
  await set(dbRef(database, `media/categories/${id}`), { label });
}
