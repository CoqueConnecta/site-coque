import { Globe } from 'lucide-react';
import { cn } from '../../../lib/cn';
import type { CmsLanguage } from '../../../types/cms';

export interface LanguageBarProps {
  language: CmsLanguage;
  onLanguageChange: (lang: CmsLanguage) => void;
  className?: string;
}

export function LanguageBar({ language, onLanguageChange, className }: LanguageBarProps) {
  return (
    <div
      className={cn(
        'hidden h-8 w-full items-center justify-center gap-3 bg-[#411409] px-6 md:flex',
        className
      )}
    >
      <Globe className="h-3.5 w-3.5 text-[#f9b778]/50" aria-hidden="true" />
      <span className="select-none text-[11px] text-[#fef7ee]/50">
        Idioma · Language
      </span>
      <div className="flex items-center gap-2 text-[11px]">
        <button
          type="button"
          aria-label="Português"
          aria-pressed={language === 'pt'}
          onClick={() => onLanguageChange('pt')}
          className={cn(
            'transition hover:text-[#f9b778]',
            language === 'pt' ? 'font-semibold text-[#f9b778]' : 'text-[#f9b778]/60'
          )}
        >
          🇧🇷 PT
        </button>
        <span className="text-[#f9b778]/20" aria-hidden="true">|</span>
        <button
          type="button"
          aria-label="English"
          aria-pressed={language === 'en'}
          onClick={() => onLanguageChange('en')}
          className={cn(
            'transition hover:text-[#f9b778]',
            language === 'en' ? 'font-semibold text-[#f9b778]' : 'text-[#f9b778]/60'
          )}
        >
          🇬🇧 EN
        </button>
      </div>
    </div>
  );
}

LanguageBar.displayName = 'LanguageBar';
