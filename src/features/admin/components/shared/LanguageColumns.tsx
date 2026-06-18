import * as Tabs from '@radix-ui/react-tabs';
import type { CmsLanguage } from '../../../../types/cms';

type LanguageColumnsProps = {
  mobileLanguage: CmsLanguage;
  onMobileLanguageChange: (lang: CmsLanguage) => void;
  isGlobal?: boolean;
  children: [React.ReactNode, React.ReactNode]; // [ptPanel, enPanel]
};

function LangBadge({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-[var(--admin-active-bg)] text-[var(--admin-active-text)]">
        {code}
      </span>
      <span className="text-xs text-[var(--admin-text-4)]">{label}</span>
    </div>
  );
}

/**
 * On desktop: renders PT and EN side-by-side (2 columns).
 * On mobile: renders PT/EN tab switcher, showing one panel at a time.
 * When isGlobal=true: renders a single full-width panel with a "Global" label.
 */
export function LanguageColumns({
  mobileLanguage,
  onMobileLanguageChange,
  isGlobal = false,
  children,
}: LanguageColumnsProps) {
  const [ptPanel, enPanel] = children;

  if (isGlobal) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-[var(--admin-surface-2)] text-[var(--admin-text-3)]">
            Global
          </span>
          <span className="text-xs text-[var(--admin-text-4)]">aplica para PT e EN</span>
        </div>
        {ptPanel}
      </div>
    );
  }

  return (
    <div>
      {/* Mobile tab switcher */}
      <Tabs.Root
        className="lg:hidden mb-4"
        value={mobileLanguage}
        onValueChange={(v) => onMobileLanguageChange(v as CmsLanguage)}
      >
        <Tabs.List className="grid w-full grid-cols-2 rounded-lg bg-[var(--admin-surface-2)] p-1">
          <Tabs.Trigger
            value="pt"
            className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--admin-text-3)] transition-all data-[state=active]:bg-[var(--admin-surface)] data-[state=active]:text-[var(--admin-text-1)] data-[state=active]:shadow-sm"
          >
            Português
          </Tabs.Trigger>
          <Tabs.Trigger
            value="en"
            className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--admin-text-3)] transition-all data-[state=active]:bg-[var(--admin-surface)] data-[state=active]:text-[var(--admin-text-1)] data-[state=active]:shadow-sm"
          >
            English
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {/* Mobile: show only active language */}
      <div className={`lg:hidden ${mobileLanguage === 'pt' ? 'block' : 'hidden'}`}>{ptPanel}</div>
      <div className={`lg:hidden ${mobileLanguage === 'en' ? 'block' : 'hidden'}`}>{enPanel}</div>

      {/* Desktop: side-by-side */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
        <div>
          <LangBadge code="PT" label="Português" />
          {ptPanel}
        </div>
        <div>
          <LangBadge code="EN" label="English" />
          {enPanel}
        </div>
      </div>
    </div>
  );
}
