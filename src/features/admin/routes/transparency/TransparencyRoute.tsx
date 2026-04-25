import { SectionCard } from '../../components/shared/SectionCard';
import { TransparencyEditor } from './editors/TransparencyEditor';
import type { AdminRouteProps } from '../types';

export function TransparencyRoute({ cmsData, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, sectionDirtyCount }: AdminRouteProps) {
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
      />
    </SectionCard>
  );
}
