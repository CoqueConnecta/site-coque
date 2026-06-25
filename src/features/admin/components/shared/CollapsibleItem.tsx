import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Copy, Trash2 } from 'lucide-react';

type CollapsibleItemProps = {
  label: string;
  summary?: string;
  onRemove: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function CollapsibleItem({ label, summary, onRemove, onDuplicate, onMoveUp, onMoveDown, children, defaultOpen = false }: CollapsibleItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-md border border-[var(--admin-border-sub)] bg-[var(--admin-surface)] shadow-sm overflow-hidden">
      <div className="flex items-center px-4 py-2.5 gap-2 bg-[var(--admin-surface-2)]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
        >
          {open
            ? <ChevronUp className="h-3.5 w-3.5 text-[var(--admin-text-4)] shrink-0" />
            : <ChevronDown className="h-3.5 w-3.5 text-[var(--admin-text-4)] shrink-0" />}
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-3)] shrink-0">{label}</span>
          {summary && (
            <span className="text-xs text-[var(--admin-text-4)] truncate min-w-0">— {summary}</span>
          )}
        </button>
        {onMoveUp && (
          <button
            type="button"
            onClick={onMoveUp}
            aria-label="Mover para cima"
            className="text-[var(--admin-text-4)] hover:text-[var(--admin-text-1)] transition-colors shrink-0"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            onClick={onMoveDown}
            aria-label="Mover para baixo"
            className="text-[var(--admin-text-4)] hover:text-[var(--admin-text-1)] transition-colors shrink-0"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        )}
        {onDuplicate && (
          <button
            type="button"
            onClick={onDuplicate}
            aria-label="Duplicar"
            className="text-[var(--admin-text-4)] hover:text-[var(--admin-text-1)] transition-colors shrink-0"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover"
          className="text-rose-400 hover:text-rose-600 transition-colors shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {open && (
        <div className="border-t border-[var(--admin-border-sub)] px-4 pt-4 pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}
