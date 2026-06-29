import { useOutletContext } from 'react-router-dom';
import { SectionCard } from '../../components/shared/SectionCard';
import { PrivacyEditor } from './editors/PrivacyEditor';
import type { AdminOutletContext } from '../types';

export function PrivacyRoute() {
  const { cmsData, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, onMoveArrayItem, onDuplicateArrayItem, sectionDirtyCount } = useOutletContext<AdminOutletContext>();
  const sk = 'pages.privacy';
  return (
    <SectionCard title="Privacidade" dirtyCount={sectionDirtyCount(sk)} defaultOpen>
      <PrivacyEditor
        data={cmsData.pages.privacy as any}
        sectionKey={sk}
        isFieldDirty={(path) => isFieldDirty(path, sk)}
        onFieldChange={(path, value) => onFieldChange(sk, path, value)}
        onAddArrayItem={(path) => onAddArrayItem(sk, path)}
        onRemoveArrayItem={(path, index) => onRemoveArrayItem(sk, path, index)}
        onMoveArrayItem={(path, index, direction) => onMoveArrayItem(sk, path, index, direction)}
        onDuplicateArrayItem={(path, index) => onDuplicateArrayItem(sk, path, index)}
      />
    </SectionCard>
  );
}
