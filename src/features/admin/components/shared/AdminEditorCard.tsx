type AdminEditorCardProps = {
  title: string;
  description?: string;
  badgeText?: string;
  children: React.ReactNode;
};

export function AdminEditorCard({
  title,
  description,
  badgeText,
  children,
}: AdminEditorCardProps) {
  return (
    <div className="space-y-4 rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 shadow-sm sm:p-5">
      <div className="border-b border-[var(--admin-border)] pb-3">
        {badgeText && (
          <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold bg-[var(--admin-active-bg)] text-[var(--admin-active-text)] mb-2">
            {badgeText}
          </span>
        )}
        <h3 className="text-sm font-semibold tracking-tight text-[var(--admin-text-1)]">{title}</h3>
        {description ? <p className="mt-0.5 text-xs text-[var(--admin-text-3)]">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
