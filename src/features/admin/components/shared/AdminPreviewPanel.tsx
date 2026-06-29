import type { ReactNode } from 'react';
import { CollapsiblePreview } from './CollapsiblePreview';
import type { CmsLanguage } from '../../../../types/cms';

type AdminPreviewPanelProps = {
  children: ReactNode;
  language?: CmsLanguage;
  onLanguageChange?: (language: CmsLanguage) => void;
};

export function AdminPreviewPanel({ children, language, onLanguageChange }: AdminPreviewPanelProps) {
  return (
    <div className="col-span-full">
      <CollapsiblePreview
        label="Pré-visualização"
        defaultOpen
        framePadding="p-6 sm:p-8 lg:p-10"
        headerExtra={
          language && onLanguageChange ? (
            <div className="inline-flex rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-1">
              {(['pt', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`rounded px-3 py-1 text-xs font-semibold transition ${
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
          ) : null
        }
      >
        {children}
      </CollapsiblePreview>
    </div>
  );
}
