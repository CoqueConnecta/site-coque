import { useOutletContext } from 'react-router-dom';
import { SectionCard } from '../../components/shared/SectionCard';
import { TransparencyEditor } from './editors/TransparencyEditor';
import type { AdminOutletContext } from '../types';

export function TransparencyRoute() {
  const { cmsData, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, onMoveArrayItem, onDuplicateArrayItem, sectionDirtyCount } = useOutletContext<AdminOutletContext>();
  const sk = 'pages.transparency';
  return (
    <SectionCard title="Transparência" dirtyCount={sectionDirtyCount(sk)} defaultOpen>
      <TransparencyEditor
        data={cmsData.pages.transparency as any}
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
