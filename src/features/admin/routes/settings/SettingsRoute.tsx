import { useOutletContext } from 'react-router-dom';
import { SectionCard } from '../../components/shared/SectionCard';
import { NavEditor } from './editors/NavEditor';
import { FooterEditor } from './editors/FooterEditor';
import { NewsletterEditor } from './editors/NewsletterEditor';
import type { AdminOutletContext } from '../types';

const SECTIONS = [
  { key: 'shared.nav',        label: 'Navegação'  },
  { key: 'shared.footer',     label: 'Rodapé'     },
  { key: 'shared.newsletter', label: 'Newsletter' },
];

export function SettingsRoute() {
  const {
    cmsData,
    isFieldDirty,
    onFieldChange,
    onAddArrayItem,
    onRemoveArrayItem,
    onMoveArrayItem,
    onDuplicateArrayItem,
    sectionDirtyCount,
  } = useOutletContext<AdminOutletContext>();
  return (
    <div className="space-y-4">
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
              onMoveArrayItem={(path, index, direction) => onMoveArrayItem(key, path, index, direction)}
              onDuplicateArrayItem={(path, index) => onDuplicateArrayItem(key, path, index)}
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
              onMoveArrayItem={(path, index, direction) => onMoveArrayItem(key, path, index, direction)}
              onDuplicateArrayItem={(path, index) => onDuplicateArrayItem(key, path, index)}
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
