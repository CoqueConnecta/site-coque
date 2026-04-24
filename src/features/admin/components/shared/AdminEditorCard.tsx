type AdminEditorCardProps = {
  title: string;
  description?: string;
  badgeText?: string;
  children: React.ReactNode;
};

export function AdminEditorCard({
  title,
  description,
  badgeText = 'Editor',
  children,
}: AdminEditorCardProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-6 lg:p-7">
      <div className="border-b border-gray-100 pb-4">
        <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
          {badgeText}
        </span>
        <h3 className="mt-3 text-lg font-bold tracking-tight text-gray-900 lg:text-xl">{title}</h3>
        {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
