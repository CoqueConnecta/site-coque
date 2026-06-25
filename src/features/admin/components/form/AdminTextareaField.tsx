import {
  adminFieldLabelClass,
  getAdminTextareaClass,
} from '../shared/adminEditorStyles';

type AdminTextareaFieldProps = {
  label: string;
  path: Array<string | number>;
  value: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  rows?: number;
};

export function AdminTextareaField({
  label,
  path,
  value,
  isFieldDirty,
  onFieldChange,
  rows = 6,
}: AdminTextareaFieldProps) {
  return (
    <label className="block">
      <span className={adminFieldLabelClass}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onFieldChange(path, e.target.value)}
        className={getAdminTextareaClass(isFieldDirty(path))}
        rows={rows}
      />
    </label>
  );
}
