import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCgaQTy2jYKbfu9aoQl-d--EMO-FRhnQj8',
  authDomain: 'site-coque.firebaseapp.com',
  databaseURL: 'https://site-coque-default-rtdb.firebaseio.com',
  projectId: 'site-coque',
  storageBucket: 'site-coque.firebasestorage.app',
  messagingSenderId: '754360342619',
  appId: '1:754360342619:web:586d5f8bb290e8fe3f077e',
};

function toLabels(ptValue, enValue) {
  return {
    pt: ptValue ?? '',
    en: enValue ?? ptValue ?? '',
  };
}

function migrateNav(globalData, pt, en) {
  if (globalData.nav && Array.isArray(globalData.nav.links) && globalData.nav.cta) {
    return globalData.nav;
  }

  const ptNav = pt.nav || {};
  const enNav = en.nav || {};
  const ptLinks = Array.isArray(ptNav.links) ? ptNav.links : [];
  const enLinks = Array.isArray(enNav.links) ? enNav.links : [];

  return {
    links: ptLinks.map((link, idx) => ({
      id: link?.id ?? `link-${idx + 1}`,
      href: link?.href ?? '/',
      labels: link?.labels?.pt !== undefined
        ? link.labels
        : toLabels(link?.label, enLinks[idx]?.label),
    })),
    cta: {
      href: ptNav?.cta?.href ?? enNav?.cta?.href ?? '/',
      labels: ptNav?.cta?.labels?.pt !== undefined
        ? ptNav.cta.labels
        : toLabels(ptNav?.cta?.label, enNav?.cta?.label),
    },
  };
}

function migrateStats(globalData, pt, en) {
  if (
    globalData.stats
    && Array.isArray(globalData.stats.items)
    && globalData.stats.items.every((item) => item?.labels)
  ) {
    return globalData.stats;
  }

  const ptItems = Array.isArray(pt?.stats?.items) ? pt.stats.items : [];
  const enItems = Array.isArray(en?.stats?.items) ? en.stats.items : [];

  return {
    items: ptItems.map((item, idx) => ({
      value: item?.value ?? '',
      labels: item?.labels?.pt !== undefined
        ? item.labels
        : toLabels(item?.label, enItems[idx]?.label),
    })),
  };
}

function migrateFooter(globalData, pt, en) {
  if (
    globalData.footer
    && globalData.footer.copyrights
    && Array.isArray(globalData.footer.quickLinks)
  ) {
    return globalData.footer;
  }

  const ptFooter = pt.footer || {};
  const enFooter = en.footer || {};
  const ptQuick = Array.isArray(ptFooter.quickLinks) ? ptFooter.quickLinks : [];
  const enQuick = Array.isArray(enFooter.quickLinks) ? enFooter.quickLinks : [];

  return {
    copyrights: ptFooter?.copyrights?.pt !== undefined
      ? ptFooter.copyrights
      : toLabels(ptFooter?.copyright, enFooter?.copyright),
    address: ptFooter?.address ?? enFooter?.address ?? '',
    phone: ptFooter?.phone ?? enFooter?.phone ?? '',
    email: ptFooter?.email ?? enFooter?.email ?? '',
    socialLinks: Array.isArray(ptFooter?.socialLinks)
      ? ptFooter.socialLinks
      : (Array.isArray(enFooter?.socialLinks) ? enFooter.socialLinks : []),
    quickLinks: ptQuick.map((link, idx) => ({
      href: link?.href ?? '/',
      labels: link?.labels?.pt !== undefined
        ? link.labels
        : toLabels(link?.label, enQuick[idx]?.label),
    })),
  };
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const rootSnap = await get(ref(db, 'cms/v2/landing'));
  if (!rootSnap.exists()) {
    throw new Error('cms/v2/landing nao existe');
  }

  const landing = rootSnap.val() || {};
  const pt = landing.pt || {};
  const en = landing.en || {};
  const globalData = landing.global || {};

  const payload = {
    'cms/v2/landing/global/aboutMedia':
      globalData.aboutMedia ?? pt.aboutMedia ?? en.aboutMedia ?? { tickerImages: [], youtubeVideos: [] },
    'cms/v2/landing/global/nav': migrateNav(globalData, pt, en),
    'cms/v2/landing/global/stats': migrateStats(globalData, pt, en),
    'cms/v2/landing/global/footer': migrateFooter(globalData, pt, en),
  };

  await update(ref(db), payload);

  console.log('Migracao concluida. Chaves gravadas:');
  Object.keys(payload).forEach((key) => console.log(`- ${key}`));
}

main().catch((error) => {
  console.error('Falha na migracao global:', error);
  process.exit(1);
});
