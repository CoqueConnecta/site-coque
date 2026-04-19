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

const TARGET_PATHS = [
  'cms/v2/landing/global/aboutMedia/youtubeVideos',
  'cms/v2/landing/pt/aboutMedia/youtubeVideos',
  'cms/v2/landing/en/aboutMedia/youtubeVideos',
];

function hasTitles(video) {
  return Boolean(
    video
    && typeof video === 'object'
    && video.titles
    && typeof video.titles === 'object'
    && typeof video.titles.pt === 'string'
    && typeof video.titles.en === 'string'
  );
}

function migrateVideo(video) {
  if (!video || typeof video !== 'object') {
    return { migrated: false, video };
  }

  if (hasTitles(video)) {
    return { migrated: false, video };
  }

  const legacyTitle = typeof video.title === 'string' ? video.title : '';
  const migratedVideo = {
    ...video,
    titles: {
      pt: legacyTitle,
      en: legacyTitle,
    },
  };

  // Remove legacy field after migration so source of truth is titles.pt/en.
  delete migratedVideo.title;

  return { migrated: true, video: migratedVideo };
}

async function main() {
  const shouldApply = process.argv.includes('--apply');
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const updatePayload = {};
  let totalFound = 0;
  let totalMigrated = 0;

  for (const path of TARGET_PATHS) {
    const snapshot = await get(ref(db, path));
    if (!snapshot.exists()) {
      console.log(`[SKIP] ${path} (nao existe)`);
      continue;
    }

    const currentValue = snapshot.val();
    if (!Array.isArray(currentValue)) {
      console.log(`[SKIP] ${path} (nao e array)`);
      continue;
    }

    totalFound += currentValue.length;
    const nextValue = currentValue.map((item) => migrateVideo(item));
    const migratedInPath = nextValue.filter((item) => item.migrated).length;
    totalMigrated += migratedInPath;

    if (migratedInPath === 0) {
      console.log(`[OK] ${path} (sem itens legados)`);
      continue;
    }

    updatePayload[path] = nextValue.map((item) => item.video);
    console.log(`[PLAN] ${path} -> ${migratedInPath} item(ns) migrado(s)`);
  }

  console.log('---');
  console.log(`Itens encontrados: ${totalFound}`);
  console.log(`Itens que exigem migracao: ${totalMigrated}`);

  if (!shouldApply) {
    console.log('Modo dry-run (sem escrita). Para aplicar, execute com --apply.');
    return;
  }

  if (Object.keys(updatePayload).length === 0) {
    console.log('Nada para escrever. Banco ja esta normalizado.');
    return;
  }

  await update(ref(db), updatePayload);
  console.log(`Migracao aplicada com sucesso. Caminhos atualizados: ${Object.keys(updatePayload).length}`);
}

main().catch((error) => {
  console.error('Falha na migracao de youtubeVideos:', error);
  process.exit(1);
});
