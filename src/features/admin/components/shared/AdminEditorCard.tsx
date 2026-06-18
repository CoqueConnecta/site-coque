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
    <div className="space-y-5 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm sm:p-6">
      <div className="border-b border-[var(--admin-border)] pb-4">
        {badgeText && (
          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold bg-[var(--admin-active-bg)] text-[var(--admin-active-text)] mb-2">
            {badgeText}
          </span>
        )}
        <h3 className="text-base font-semibold tracking-tight text-[var(--admin-text-1)]">{title}</h3>
        {description ? <p className="mt-1 text-sm text-[var(--admin-text-3)]">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
