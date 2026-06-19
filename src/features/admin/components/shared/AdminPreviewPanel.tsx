import type { ReactNode } from 'react';
import { adminFieldLabelClass } from './adminEditorStyles';
import type { CmsLanguage } from '../../../../types/cms';

type AdminPreviewPanelProps = {
  children: ReactNode;
  language?: CmsLanguage;
  onLanguageChange?: (language: CmsLanguage) => void;
};

export function AdminPreviewPanel({ children, language, onLanguageChange }: AdminPreviewPanelProps) {
  return (
    <div className="col-span-full space-y-3">
      <div className="flex items-center justify-between">
        <span className={adminFieldLabelClass}>Pré-visualização</span>
        {language && onLanguageChange && (
          <div className="inline-flex rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-1">
            {(['pt', 'en'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                  language === lang
                    ? 'bg-[var(--admin-active-bg)] text-[var(--admin-active-text)]'
                    : 'text-[var(--admin-text-3)] hover:text-[var(--admin-text-1)]'
                }`}
                aria-pressed={language === lang}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[color:var(--color-surface-page)]">
        {children}
      </div>
    </div>
  );
}
