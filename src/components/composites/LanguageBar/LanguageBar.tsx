import { Globe } from 'lucide-react';
import { cn } from '../../../lib/cn';
import type { CmsLanguage } from '../../../types/cms';

export interface LanguageBarProps {
  language: CmsLanguage;
  onLanguageChange: (lang: CmsLanguage) => void;
  isFixed?: boolean;
  className?: string;
}

export function LanguageBar({ language, onLanguageChange, isFixed = false, className }: LanguageBarProps) {
  return (
    <div
      className={cn(
        'hidden h-8 w-full items-center justify-center gap-3 bg-[color:var(--color-tag-bg)] px-6 md:flex',
        isFixed && 'fixed top-0 z-50',
        className
      )}
    >
      <Globe className="h-3.5 w-3.5 text-[color:var(--color-accent-peach)]/50" aria-hidden="true" />
      <span className="select-none text-[11px] text-[color:var(--color-text-cream)]/50">
        Idioma · Language
      </span>
      <div className="flex items-center gap-2 text-[11px]">
        <button
          type="button"
          aria-label="Português"
          aria-pressed={language === 'pt'}
          onClick={() => onLanguageChange('pt')}
          className={cn(
            'transition hover:text-[color:var(--color-accent-peach)]',
            language === 'pt' ? 'font-semibold text-[color:var(--color-accent-peach)]' : 'text-[color:var(--color-accent-peach)]/60'
          )}
        >
          🇧🇷 PT
        </button>
        <span className="text-[color:var(--color-accent-peach)]/20" aria-hidden="true">|</span>
        <button
          type="button"
          aria-label="English"
          aria-pressed={language === 'en'}
          onClick={() => onLanguageChange('en')}
          className={cn(
            'transition hover:text-[color:var(--color-accent-peach)]',
            language === 'en' ? 'font-semibold text-[color:var(--color-accent-peach)]' : 'text-[color:var(--color-accent-peach)]/60'
          )}
        >
          🇬🇧 EN
        </button>
      </div>
    </div>
  );
}

LanguageBar.displayName = 'LanguageBar';
