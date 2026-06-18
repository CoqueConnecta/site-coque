import { Plus } from 'lucide-react';

type AdminAddButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'xs';
};

export function AdminAddButton({ onClick, children, size = 'sm' }: AdminAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg font-medium transition-colors
        text-[var(--admin-accent)] hover:bg-[var(--admin-active-bg)] hover:text-[var(--admin-active-text)]
        ${size === 'sm' ? 'text-sm px-3 py-2' : 'text-xs px-2 py-1'}`}
    >
      <Plus className={size === 'sm' ? 'h-4 w-4' : 'h-3 w-3'} />
      {children}
    </button>
  );
}
