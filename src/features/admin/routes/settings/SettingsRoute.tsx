import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import toast from 'react-hot-toast';
import { database } from '../../../../../firebase';
import { migrateLocalImagesToStorage } from '../../services/migrationService';
import { SectionCard } from '../../components/shared/SectionCard';
import { NavEditor } from './editors/NavEditor';
import { FooterEditor } from './editors/FooterEditor';
import { NewsletterEditor } from './editors/NewsletterEditor';
import type { AdminRouteProps } from '../types';

const SECTIONS = [
  { key: 'shared.nav',        label: 'Navegação'  },
  { key: 'shared.footer',     label: 'Rodapé'     },
  { key: 'shared.newsletter', label: 'Newsletter' },
];

function MigrationCard() {
  const [isMigrated, setIsMigrated] = useState<boolean | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  useEffect(() => {
    get(ref(database, 'media/library')).then((snap) => {
      setIsMigrated(snap.exists());
    });
  }, []);

  if (isMigrated === null || isMigrated) return null;

  const handleMigrate = async () => {
    setIsMigrating(true);
    try {
      await migrateLocalImagesToStorage((done, total) => setProgress({ done, total }));
      toast.success('Migração concluída! Todas as imagens estão no Firebase Storage.');
      setIsMigrated(true);
    } catch (err) {
      toast.error('Erro durante a migração. Verifique o console e tente novamente.');
      console.error(err);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-3">
      <div>
        <h3 className="text-sm font-bold text-amber-800">Migração de imagens (ação única)</h3>
        <p className="mt-1 text-sm text-amber-700">
          Envia as imagens locais do repositório para o Firebase Storage e atualiza as referências no RTDB.
          Execute uma única vez após ativar o Storage.
        </p>
      </div>

      {isMigrating && progress.total > 0 && (
        <div className="space-y-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-amber-200">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-200"
              style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-amber-700">{progress.done} / {progress.total} imagens enviadas</p>
        </div>
      )}

      <button
        type="button"
        disabled={isMigrating}
        onClick={handleMigrate}
        className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {isMigrating ? 'Migrando...' : 'Migrar imagens locais para Firebase'}
      </button>
    </div>
  );
}

export function SettingsRoute({
  cmsData,
  isFieldDirty,
  onFieldChange,
  onAddArrayItem,
  onRemoveArrayItem,
  sectionDirtyCount,
}: AdminRouteProps) {
  return (
    <div className="space-y-4">
      <MigrationCard />

      {SECTIONS.map(({ key, label }) => (
        <SectionCard key={key} title={label} dirtyCount={sectionDirtyCount(key)}>
          {key === 'shared.nav' && (
            <NavEditor
              data={cmsData.shared.nav as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
            />
          )}
          {key === 'shared.footer' && (
            <FooterEditor
              data={cmsData.shared.footer as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
            />
          )}
          {key === 'shared.newsletter' && (
            <NewsletterEditor
              data={cmsData.shared.newsletter as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
            />
          )}
        </SectionCard>
      ))}
    </div>
  );
}
