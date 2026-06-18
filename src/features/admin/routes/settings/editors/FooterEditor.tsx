import { AdminEditorCard } from '../../../components/shared/AdminEditorCard';
import {
  adminFieldLabelClass,
  adminPanelGridClass,
  adminSectionItemClass,
  adminSectionTitleClass,
  getAdminInputClass,
} from '../../../components/shared/adminEditorStyles';
import { AdminAddButton } from '../../../components/shared/AdminAddButton';
import { Trash2 } from 'lucide-react';

type I18nField = { pt?: string; en?: string };

type FooterEditorProps = {
  data: {
    address?: string;
    phone?: string;
    email?: string;
    copyrights?: I18nField;
    socialLinks?: Array<{ platform?: string; url?: string; icon?: string }>;
    quickLinks?: Array<{ href?: string; labels?: I18nField }>;
  };
  sectionKey: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  onAddArrayItem: (path: Array<string | number>) => void;
  onRemoveArrayItem: (path: Array<string | number>, index: number) => void;
};

export function FooterEditor({ data, isFieldDirty, onFieldChange, onAddArrayItem, onRemoveArrayItem }: FooterEditorProps) {
  const socialLinks = Array.isArray(data?.socialLinks) ? data.socialLinks : [];
  const quickLinks = Array.isArray(data?.quickLinks) ? data.quickLinks : [];

  return (
    <div className="space-y-6">
      {/* Global contact info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['address', 'phone', 'email'] as const).map((field) => (
          <label key={field} className="block">
            <span className={adminFieldLabelClass}>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
            <input type="text" value={(data[field] as string) ?? ''} onChange={(e) => onFieldChange([field], e.target.value)} className={getAdminInputClass(isFieldDirty([field]))} />
          </label>
        ))}
      </div>

      {/* Copyrights i18n */}
      <div className={adminPanelGridClass}>
        {(['pt', 'en'] as const).map((lang) => (
          <AdminEditorCard key={lang} title={lang === 'pt' ? 'Copyright (PT)' : 'Copyright (EN)'}>
            <input type="text" value={data.copyrights?.[lang] ?? ''} onChange={(e) => onFieldChange(['copyrights', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['copyrights', lang]))} />
          </AdminEditorCard>
        ))}
      </div>

      {/* Social links */}
      <h4 className={adminSectionTitleClass}>Redes Sociais</h4>
      {socialLinks.map((link, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
          <label className="block"><span className={adminFieldLabelClass}>Plataforma</span><input type="text" value={link.platform ?? ''} onChange={(e) => onFieldChange(['socialLinks', index, 'platform'], e.target.value)} className={getAdminInputClass(isFieldDirty(['socialLinks', index, 'platform']))} /></label>
          <label className="block"><span className={adminFieldLabelClass}>URL</span><input type="text" value={link.url ?? ''} onChange={(e) => onFieldChange(['socialLinks', index, 'url'], e.target.value)} className={getAdminInputClass(isFieldDirty(['socialLinks', index, 'url']))} /></label>
          <label className="block"><span className={adminFieldLabelClass}>Ícone</span><input type="text" value={link.icon ?? ''} onChange={(e) => onFieldChange(['socialLinks', index, 'icon'], e.target.value)} className={getAdminInputClass(isFieldDirty(['socialLinks', index, 'icon']))} /></label>
          <button type="button" onClick={() => onRemoveArrayItem(['socialLinks'], index)} className="text-rose-500 hover:text-rose-700 transition-colors mb-1"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['socialLinks'])}>Rede social</AdminAddButton>

      {/* Quick links */}
      <h4 className={adminSectionTitleClass}>Links Rápidos</h4>
      {quickLinks.map((link, index) => (
        <div key={index} className={adminSectionItemClass}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-[var(--admin-text-2)]">Link {index + 1}</span>
            <button type="button" onClick={() => onRemoveArrayItem(['quickLinks'], index)} className="text-rose-500 hover:text-rose-700 transition-colors"><Trash2 className="h-4 w-4" /></button>
          </div>
          <label className="block"><span className={adminFieldLabelClass}>href</span><input type="text" value={link.href ?? ''} onChange={(e) => onFieldChange(['quickLinks', index, 'href'], e.target.value)} className={getAdminInputClass(isFieldDirty(['quickLinks', index, 'href']))} /></label>
          <div className={adminPanelGridClass}>
            {(['pt', 'en'] as const).map((lang) => (
              <AdminEditorCard key={lang} title={lang === 'pt' ? 'Rótulo (PT)' : 'Label (EN)'}>
                <input type="text" value={link.labels?.[lang] ?? ''} onChange={(e) => onFieldChange(['quickLinks', index, 'labels', lang], e.target.value)} className={getAdminInputClass(isFieldDirty(['quickLinks', index, 'labels', lang]))} />
              </AdminEditorCard>
            ))}
          </div>
        </div>
      ))}
      <AdminAddButton onClick={() => onAddArrayItem(['quickLinks'])}>Link rápido</AdminAddButton>
    </div>
  );
}
