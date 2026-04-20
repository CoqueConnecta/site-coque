type ImageFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  isDirty?: boolean;
  onChange: (value: string) => void;
  onOpenLibrary: () => void;
};

import {
  adminFieldLabelClass,
  adminPrimaryGhostButtonClass,
  getAdminInputClass,
} from './adminEditorStyles';

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
    <div className={`space-y-3 rounded-2xl border bg-gray-50/80 p-4 ${isDirty ? 'border-amber-300' : 'border-gray-100'}`}>
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
            Biblioteca local
          </button>
        </div>
      </label>

      {canPreview ? (
        <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm shadow-gray-100/70">
          <img src={previewSource} alt="Prévia da imagem" className="max-h-40 w-full rounded object-cover" />
        </div>
      ) : null}
    </div>
  );
}
