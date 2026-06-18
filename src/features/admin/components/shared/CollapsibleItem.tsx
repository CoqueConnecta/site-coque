import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

type CollapsibleItemProps = {
  label: string;
  summary?: string;
  onRemove: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function CollapsibleItem({ label, summary, onRemove, children, defaultOpen = false }: CollapsibleItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-[var(--admin-border-sub)] bg-[var(--admin-surface)] shadow-sm overflow-hidden">
      <div className="flex items-center px-4 py-3 gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
        >
          {open
            ? <ChevronUp className="h-4 w-4 text-[var(--admin-text-4)] shrink-0" />
            : <ChevronDown className="h-4 w-4 text-[var(--admin-text-4)] shrink-0" />}
          <span className="text-sm font-semibold text-[var(--admin-text-2)] shrink-0">{label}</span>
          {summary && (
            <span className="text-xs text-[var(--admin-text-4)] truncate min-w-0">— {summary}</span>
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-rose-500 hover:text-rose-700 transition-colors shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {open && (
        <div className="border-t border-[var(--admin-border-sub)] px-4 pt-4 pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
