import { signInWithPopup, signOut, onAuthStateChanged, type User, type Unsubscribe } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, googleProvider, database } from '../../firebase';

export function signInWithGoogle(): Promise<User> {
  return signInWithPopup(auth, googleProvider).then((result) => result.user);
}

export function signOutUser(): Promise<void> {
  return signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export async function reloadCurrentUser(user: User): Promise<void> {
  try {
    await user.reload();
  } catch {
    // Ignore reload errors and keep the current session info.
  }
}

interface AdminEntry {
  email: string;
  isAdmin: boolean;
}

export async function checkIsAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const snapshot = await get(ref(database, 'admins'));
  if (!snapshot.exists()) return false;
  const adminList: AdminEntry[] = snapshot.val();
  return adminList.some((admin) => admin.email === email && admin.isAdmin === true);
}
