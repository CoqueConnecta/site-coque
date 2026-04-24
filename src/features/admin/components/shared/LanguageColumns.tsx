import * as Tabs from '@radix-ui/react-tabs';
import type { CmsLanguage } from '../../../../types/cms';

type LanguageColumnsProps = {
  mobileLanguage: CmsLanguage;
  onMobileLanguageChange: (lang: CmsLanguage) => void;
  isGlobal?: boolean;
  children: [React.ReactNode, React.ReactNode]; // [ptPanel, enPanel]
};

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
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">
          Global — aplica para PT e EN
        </p>
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
        <Tabs.List className="grid w-full grid-cols-2 rounded-lg bg-gray-100 p-1">
          <Tabs.Trigger
            value="pt"
            className="rounded-md px-3 py-2 text-sm font-semibold text-gray-600 transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            Português
          </Tabs.Trigger>
          <Tabs.Trigger
            value="en"
            className="rounded-md px-3 py-2 text-sm font-semibold text-gray-600 transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
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
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">Português</p>
          {ptPanel}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">English</p>
          {enPanel}
        </div>
      </div>
    </div>
  );
}
