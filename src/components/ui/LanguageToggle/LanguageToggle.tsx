import { useState } from 'react';
import { cn } from '../../../lib/cn';
import { useClickOutside } from '../../../hooks/useClickOutside';
import type { CmsLanguage } from '../../../types/cms';

interface LanguageOption {
  value: CmsLanguage;
  label: string;
  shortLabel: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { value: 'pt', label: 'Português', shortLabel: 'PT', flag: '🇧🇷' },
  { value: 'en', label: 'English', shortLabel: 'EN', flag: '🇬🇧' },
];

export interface LanguageToggleProps {
  value: CmsLanguage;
  onChange: (language: CmsLanguage) => void;
  compact?: boolean;
  className?: string;
}

export function LanguageToggle({ value, onChange, compact = false, className }: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const currentLanguage = languageOptions.find((option) => option.value === value) ?? languageOptions[0];

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/85 px-4 py-2 text-[#2e3350] shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition hover:bg-white',
          compact ? 'h-[44px]' : 'h-[48px]'
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Selecionar idioma"
      >
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-[#eef1ff] px-2 text-xs font-bold">
          {currentLanguage.flag}
        </span>
        {!compact ? <span className="text-sm font-semibold">{currentLanguage.label}</span> : null}
        <span className={cn('text-xs transition-transform', isOpen ? 'rotate-180' : '')}>^</span>
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[180px] rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_14px_30px_rgba(0,0,0,0.12)]"
        >
          {languageOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition',
                option.value === value
                  ? 'bg-[#f3f6ff] font-semibold text-[#2f3a67]'
                  : 'text-[#2e3350] hover:bg-gray-100'
              )}
            >
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[#eef1ff] px-2 text-[11px] font-bold">
                  {option.flag}
                </span>
                {option.label}
              </span>
              {option.value === value ? <span>OK</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
