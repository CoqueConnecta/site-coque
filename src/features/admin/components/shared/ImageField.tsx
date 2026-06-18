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
  onChange: (value: string) => void;
  onOpenLibrary: () => void;
};

export function ImageField({
  label,
  value,
  placeholder,
  isDirty = false,
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
            onChange={(e) => onChange(e.target.value)}
            className={getAdminInputClass(isDirty)}
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
        <div className="rounded-xl border border-[var(--admin-border-sub)] bg-[var(--admin-surface)] p-2 shadow-sm">
          <img src={previewSource} alt="Prévia da imagem" className="max-h-40 w-full rounded object-cover" />
        </div>
      ) : null}
    </div>
  );
}
