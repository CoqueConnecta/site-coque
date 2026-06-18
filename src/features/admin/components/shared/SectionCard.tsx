import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type SectionCardProps = {
  title: string;
  dirtyCount: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function SectionCard({
  title,
  dirtyCount,
  defaultOpen = false,
  children,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-[var(--admin-surface)] rounded-xl shadow-sm border border-[var(--admin-border)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--admin-surface-2)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[var(--admin-text-1)]">{title}</span>
          {dirtyCount > 0 && (
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">
              {dirtyCount} {dirtyCount === 1 ? 'alteração' : 'alterações'}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[var(--admin-text-4)] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--admin-text-4)] flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-[var(--admin-border)]">
          <div className="pt-5">{children}</div>
        </div>
      )}
    </div>
  );
}
