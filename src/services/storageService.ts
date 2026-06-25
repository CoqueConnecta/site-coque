import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push, set, onValue, type Unsubscribe } from 'firebase/database';
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
