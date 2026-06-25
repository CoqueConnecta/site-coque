import { SectionCard } from '../../components/shared/SectionCard';
import { ProjectsEditor } from './editors/ProjectsEditor';
import type { AdminRouteProps } from '../types';

export function ProjectsRoute({ cmsData, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem, onMoveArrayItem, onDuplicateArrayItem, renderImageField, sectionDirtyCount }: AdminRouteProps) {
  const sk = 'pages.projects';
  return (
    <SectionCard title="Projetos" dirtyCount={sectionDirtyCount(sk)} defaultOpen>
      <ProjectsEditor
        data={cmsData.pages.projects as any}
        sectionKey={sk}
        isFieldDirty={(path) => isFieldDirty(path, sk)}
        onFieldChange={(path, value) => onFieldChange(sk, path, value)}
        onAddArrayItem={(path) => onAddArrayItem(sk, path)}
        onRemoveArrayItem={(path, index) => onRemoveArrayItem(sk, path, index)}
        onMoveArrayItem={(path, index, direction) => onMoveArrayItem(sk, path, index, direction)}
        onDuplicateArrayItem={(path, index) => onDuplicateArrayItem(sk, path, index)}
        renderImageField={(value, path, label, placeholder) => renderImageField(sk, value, path, label, placeholder)}
      />
    </SectionCard>
  );
}
