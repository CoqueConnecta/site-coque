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
    <div className={`space-y-3 rounded-lg border bg-gray-50 p-3 ${isDirty ? 'border-amber-400' : 'border-gray-200'}`}>
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-2">{label}</span>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-800 outline-none focus:ring-2 ${
              isDirty
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={onOpenLibrary}
            className="whitespace-nowrap rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Biblioteca local
          </button>
        </div>
      </label>

      {canPreview ? (
        <div className="rounded-lg border border-gray-200 bg-white p-2">
          <img src={previewSource} alt="Prévia da imagem" className="max-h-40 w-full rounded object-cover" />
        </div>
      ) : null}
    </div>
  );
}
