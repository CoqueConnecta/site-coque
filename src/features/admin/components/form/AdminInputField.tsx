import {
  adminFieldLabelClass,
  getAdminInputClass,
} from '../shared/adminEditorStyles';

type AdminInputFieldProps = {
  label: string;
  path: Array<string | number>;
  value: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  placeholder?: string;
};

export function AdminInputField({
  label,
  path,
  value,
  isFieldDirty,
  onFieldChange,
  placeholder,
}: AdminInputFieldProps) {
  return (
    <label className="block">
      <span className={adminFieldLabelClass}>{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onFieldChange(path, e.target.value)}
        className={getAdminInputClass(isFieldDirty(path))}
      />
    </label>
  );
}
