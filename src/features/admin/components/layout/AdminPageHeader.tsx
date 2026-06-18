type AdminPageHeaderProps = {
  title: string;
  description: string;
  dirtyCount: number;
  onSave: () => void;
  onDiscard: () => void;
};

export function AdminPageHeader({
  title,
  description,
  dirtyCount,
  onSave,
  onDiscard,
}: AdminPageHeaderProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 lg:-mx-8 px-4 lg:px-8 pt-4 lg:pt-8 pb-4 bg-[var(--admin-bg)]/95 backdrop-blur-sm border-b border-[var(--admin-border)] mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--admin-text-1)] tracking-tight truncate">
            {title}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-[var(--admin-text-3)] text-sm">{description}</p>
            {dirtyCount > 0 && (
              <span className="inline-flex items-center text-xs font-semibold bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5 flex-shrink-0">
                {dirtyCount} {dirtyCount === 1 ? 'alteração' : 'alterações'}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onDiscard}
            className="h-9 px-4 rounded-xl border border-[var(--admin-border-sub)] bg-[var(--admin-surface)] text-sm font-semibold text-[var(--admin-text-2)] hover:bg-[var(--admin-surface-2)] transition-all"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="h-9 px-5 rounded-xl bg-[var(--admin-accent)] text-sm font-semibold text-white hover:opacity-90 shadow-sm transition-all"
          >
            Salvar página
          </button>
        </div>
      </div>
    </div>
  );
}
