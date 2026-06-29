import { ChevronDown, ChevronUp } from 'lucide-react';
import { useDisclosure } from '../../hooks/useDisclosure';

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
  const { isOpen: open, toggle } = useDisclosure(defaultOpen);

  return (
    <div className="bg-[var(--admin-surface)] rounded-lg shadow-sm border border-[var(--admin-border)] overflow-hidden border-l-[3px] border-l-[var(--admin-accent)]">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[var(--admin-surface-2)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-[var(--admin-text-1)]">{title}</span>
          {dirtyCount > 0 && (
            <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 rounded px-2 py-0.5 tabular-nums">
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
        <div className="px-5 pb-6 border-t border-[var(--admin-border)]">
          <div className="pt-5">{children}</div>
        </div>
      )}
    </div>
  );
}
