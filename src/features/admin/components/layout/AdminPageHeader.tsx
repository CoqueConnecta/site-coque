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
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-gray-500 mt-1 text-sm">{description}</p>
        {dirtyCount > 0 && (
          <span className="inline-block mt-2 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full px-2.5 py-0.5">
            {dirtyCount} {dirtyCount === 1 ? 'campo alterado' : 'campos alterados'}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onDiscard}
          className="h-10 px-4 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
        >
          Descartar
        </button>
        <button
          type="button"
          onClick={onSave}
          className="h-10 px-5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
        >
          Salvar página
        </button>
      </div>
    </div>
  );
}
