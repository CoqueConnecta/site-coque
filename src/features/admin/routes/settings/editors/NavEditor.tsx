import { useState } from 'react';
import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  adminSectionItemClass,
  adminSectionTitleClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { AdminPreviewPanel } from '../../../components/shared/AdminPreviewPanel';
import { HeaderBar } from '../../../../../components/composites/HeaderBar';
import { pickLang } from '../../../../../services/cmsService';
import type { CmsLanguage, ResolvedNavData } from '../../../../../types/cms';
import { Trash2 } from 'lucide-react';

type I18nField = { pt?: string; en?: string };

type NavEditorProps = {
  data: {
    links?: Array<{ id?: string; href?: string; labels?: I18nField }>;
    cta?: { href?: string; labels?: I18nField };
  };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
};

function resolvePreviewData(data: NavEditorProps['data'], language: CmsLanguage): ResolvedNavData {
  const toI18nField = (field?: I18nField): { pt: string; en: string } => ({ pt: field?.pt ?? '', en: field?.en ?? '' });

  return {
    links: (data.links ?? []).map((link) => ({
      id: link.id ?? '',
      href: link.href ?? '',
      label: pickLang(toI18nField(link.labels), language),
    })),
    cta: {
      href: data.cta?.href ?? '',
      label: pickLang(toI18nField(data.cta?.labels), language),
    },
  };
}

export function NavEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem }: NavEditorProps) {
  const [previewLang, setPreviewLang] = useState<CmsLanguage>('pt');
  const links = Array.isArray(data?.links) ? data.links : [];

  return (
    <div className="space-y-6">
      <h4 className={adminSectionTitleClass}>Links de Navegação</h4>
      {links.map((link, index) => (
        <div key={index} className={adminSectionItemClass}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-[var(--admin-text-2)]">Link {index + 1}</span>
            <button type="button" onClick={() => onRemoveArrayItem(['links'], index)} className="text-rose-500 hover:text-rose-700 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className={adminFieldLabelClass}>ID</span>
              <input type="text" value={link.id ?? ''} onChange={(e) => onFieldChange(['links', index, 'id'], e.target.value)} className={getAdminInputClass(isFieldDirty(['links', index, 'id']))} />
            </label>
            <label className="block">
              <span className={adminFieldLabelClass}>href</span>
              <input type="text" value={link.href ?? ''} onChange={(e) => onFieldChange(['links', index, 'href'], e.target.value)} className={getAdminInputClass(isFieldDirty(['links', index, 'href']))} />
            </label>
          </div>
          <div className={adminPanelGridClass}>
            {(['pt', 'en'] as const).map((lang) => (
              <AdminEditorCard key={lang} title={lang === 'pt' ? 'Rótulo (PT)' : 'Label (EN)'}>
                <label className="block">
                  <span className={adminFieldLabelClass}>Texto</span>
                  <input type="text" value={link.labels?.[lang] ?? ''} onChange={(e) => onFieldChange(['links', index, 'labels', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['links', index, 'labels', lang]))} />
                </label>
              </AdminEditorCard>
            ))}
          </div>
        </div>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['links'])}>Adicionar link</AdminAddButton>

      <h4 className={`${adminSectionTitleClass} mt-6`}>Botão CTA</h4>
      <label className="block">
        <span className={adminFieldLabelClass}>href do CTA</span>
        <input type="text" value={data.cta?.href ?? ''} onChange={(e) => onFieldChange(['cta', 'href'], e.target.value)} className={getAdminInputClass(isFieldDirty(['cta', 'href']))} />
      </label>
      <div className={adminPanelGridClass}>
        {(['pt', 'en'] as const).map((lang) => (
          <AdminEditorCard key={lang} title={lang === 'pt' ? 'CTA (PT)' : 'CTA (EN)'}>
            <input type="text" value={data.cta?.labels?.[lang] ?? ''} onChange={(e) => onFieldChange(['cta', 'labels', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['cta', 'labels', lang]))} />
          </AdminEditorCard>
        ))}
      </div>

      <AdminPreviewPanel language={previewLang} onLanguageChange={setPreviewLang}>
        <HeaderBar
          navLinks={resolvePreviewData(data, previewLang).links}
          ctaText={resolvePreviewData(data, previewLang).cta.label}
          ctaHref={resolvePreviewData(data, previewLang).cta.href}
          isFixed={false}
        />
      </AdminPreviewPanel>
    </div>
  );
}
