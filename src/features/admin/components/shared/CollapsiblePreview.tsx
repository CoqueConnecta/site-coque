import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { adminFieldLabelClass } from './adminEditorStyles';
import { useDisclosure } from '../../hooks/useDisclosure';

type CollapsiblePreviewProps = {
  label: string;
  defaultOpen?: boolean;
  headerExtra?: ReactNode;
  framePadding?: string;
  children: ReactNode;
};

export function CollapsiblePreview({
  label,
  defaultOpen = false,
  headerExtra,
  framePadding = 'p-6',
  children,
}: CollapsiblePreviewProps) {
  const { isOpen, toggle } = useDisclosure(defaultOpen);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button type="button" onClick={toggle} className="flex items-center gap-2 text-left">
          {isOpen ? (
            <ChevronUp className="h-3.5 w-3.5 text-[var(--admin-text-4)]" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-[var(--admin-text-4)]" />
          )}
          <span className={adminFieldLabelClass}>{label}</span>
        </button>
        {headerExtra}
      </div>
      {isOpen && (
        <div className={`overflow-hidden border border-[var(--admin-border)] bg-[color:var(--color-surface-page)] ${framePadding}`}>
          {children}
        </div>
      )}
    </div>
  );
}
