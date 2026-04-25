import { SectionCard } from '../../components/shared/SectionCard';
import { PrivacyEditor } from './editors/PrivacyEditor';
import type { AdminRouteProps } from '../types';

export function PrivacyRoute({ cmsData, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, sectionDirtyCount }: AdminRouteProps) {
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
      />
    </SectionCard>
  );
}
