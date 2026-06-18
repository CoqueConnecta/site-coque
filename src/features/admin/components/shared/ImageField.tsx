import {
  adminFieldLabelClass,
  adminPrimaryGhostButtonClass,
  getAdminInputClass,
} from './adminEditorStyles';

type ImageFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  isDirty?: boolean;
  readOnly?: boolean;
  onChange: (value: string) => void;
  onOpenLibrary: () => void;
};

export function ImageField({
  label,
  value,
  placeholder,
  isDirty = false,
  readOnly = false,
  onChange,
  onOpenLibrary,
}: ImageFieldProps) {
  const previewSource = value.trim();
  const canPreview = previewSource.startsWith('http') || previewSource.startsWith('/');

  return (
    <div className={`space-y-3 rounded-2xl border bg-[var(--admin-surface-2)] p-4 ${isDirty ? 'border-amber-300' : 'border-[var(--admin-border)]'}`}>
      <label className="block">
        <span className={adminFieldLabelClass}>{label}</span>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={value}
            onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
            readOnly={readOnly}
            className={`${getAdminInputClass(isDirty)}${readOnly ? ' cursor-not-allowed opacity-60 select-none' : ''}`}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={onOpenLibrary}
            className={`h-11 whitespace-nowrap sm:h-auto ${adminPrimaryGhostButtonClass}`}
          >
            Biblioteca de imagens
          </button>
        </div>
      </label>

      {canPreview ? (
        <div className="mt-1 flex items-center gap-3">
          <img
            src={previewSource}
            alt="Prévia"
            className="h-16 w-24 flex-shrink-0 rounded-lg object-cover border border-[var(--admin-border-sub)]"
          />
          <p className="min-w-0 text-xs text-[var(--admin-text-3)] break-all line-clamp-3">
            {previewSource}
          </p>
        </div>
      ) : null}
    </div>
  );
}
