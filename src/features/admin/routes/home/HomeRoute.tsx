import { useOutletContext } from 'react-router-dom';
import { SectionCard } from '../../components/shared/SectionCard';
import { HeroEditor } from './editors/HeroEditor';
import { CarouselEditor } from './editors/CarouselEditor';
import { YoutubeEditor } from './editors/YoutubeEditor';
import { WaysToHelpEditor } from './editors/WaysToHelpEditor';
import { StatsEditor } from './editors/StatsEditor';
import { AboutEditor } from './editors/AboutEditor';
import type { AdminOutletContext } from '../types';

const SECTIONS = [
  { key: 'pages.home.hero',          label: 'Hero'            },
  { key: 'pages.home.about',         label: 'Quem Somos'      },
  { key: 'pages.home.carousel',      label: 'Carrossel'       },
  { key: 'pages.home.youtubeVideos', label: 'YouTube Videos'  },
  { key: 'pages.home.waysToHelp',    label: 'Como Ajudar'     },
  { key: 'pages.home.stats',         label: 'Estatísticas'    },
];

export function HomeRoute() {
  const {
    cmsData,
    isFieldDirty,
    onFieldChange,
    onAddArrayItem,
    onRemoveArrayItem,
    onMoveArrayItem,
    onDuplicateArrayItem,
    renderImageField,
    sectionDirtyCount,
  } = useOutletContext<AdminOutletContext>();
  return (
    <div className="space-y-4">
      {SECTIONS.map(({ key, label }) => (
        <SectionCard key={key} title={label} dirtyCount={sectionDirtyCount(key)}>
          {key === 'pages.home.hero' && (
            <HeroEditor
              data={cmsData.pages.home.hero as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              renderImageField={(value, path, lbl, ph, ro) => renderImageField(key, value, path, lbl, ph, ro)}
            />
          )}
          {key === 'pages.home.about' && (
            <AboutEditor
              data={cmsData.pages.home.about as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
            />
          )}
          {key === 'pages.home.carousel' && (
            <CarouselEditor
              data={cmsData.pages.home.carousel as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
              onMoveArrayItem={(path, index, direction) => onMoveArrayItem(key, path, index, direction)}
              onDuplicateArrayItem={(path, index) => onDuplicateArrayItem(key, path, index)}
              renderImageField={(value, path, lbl, ph, ro) => renderImageField(key, value, path, lbl, ph, ro)}
            />
          )}
          {key === 'pages.home.youtubeVideos' && (
            <YoutubeEditor
              data={cmsData.pages.home.youtubeVideos as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
              onMoveArrayItem={(path, index, direction) => onMoveArrayItem(key, path, index, direction)}
              onDuplicateArrayItem={(path, index) => onDuplicateArrayItem(key, path, index)}
            />
          )}
          {key === 'pages.home.waysToHelp' && (
            <WaysToHelpEditor
              data={cmsData.pages.home.waysToHelp as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
              onMoveArrayItem={(path, index, direction) => onMoveArrayItem(key, path, index, direction)}
              onDuplicateArrayItem={(path, index) => onDuplicateArrayItem(key, path, index)}
              renderImageField={(value, path, lbl, ph, ro) => renderImageField(key, value, path, lbl, ph, ro)}
            />
          )}
          {key === 'pages.home.stats' && (
            <StatsEditor
              data={cmsData.pages.home.stats as any}
              sectionKey={key}
              isFieldDirty={(path) => isFieldDirty(path, key)}
              onFieldChange={(path, value) => onFieldChange(key, path, value)}
              onAddArrayItem={(path) => onAddArrayItem(key, path)}
              onRemoveArrayItem={(path, index) => onRemoveArrayItem(key, path, index)}
              onMoveArrayItem={(path, index, direction) => onMoveArrayItem(key, path, index, direction)}
              onDuplicateArrayItem={(path, index) => onDuplicateArrayItem(key, path, index)}
            />
          )}
        </SectionCard>
      ))}
    </div>
  );
}
