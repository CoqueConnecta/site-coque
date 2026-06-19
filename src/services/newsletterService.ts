import { ref, push, serverTimestamp } from 'firebase/database';
import { database } from '../../firebase';

export interface NewsletterSubscription {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
}

export async function subscribeToNewsletter(data: NewsletterSubscription): Promise<void> {
  const newsletterRef = ref(database, 'newsletter');
  await push(newsletterRef, {
    ...data,
    lgpdConsent: true,
    subscribedAt: serverTimestamp(),
  });
}
