import {
  adminFieldLabelClass,
  getAdminInputClass,
} from '../shared/adminEditorStyles';
import { cn } from '../../../../lib/cn';

type AdminInputFieldProps = {
  label: string;
  path: Array<string | number>;
  value: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  placeholder?: string;
  disabled?: boolean;
  helpText?: string;
  /** Visual-only: shows a red asterisk and, once the field has been touched, an error state when empty. Does not block saving. */
  required?: boolean;
};

export function AdminInputField({
  label,
  path,
  value,
  isFieldDirty,
  onFieldChange,
  placeholder,
  disabled = false,
  helpText,
  required = false,
}: AdminInputFieldProps) {
  const showRequiredError = required && value.trim() === '';

  return (
    <label className="block">
      <span className={adminFieldLabelClass}>
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onFieldChange(path, e.target.value)}
        className={cn(
          getAdminInputClass(isFieldDirty(path)),
          disabled && 'cursor-not-allowed opacity-60',
          showRequiredError && 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20'
        )}
      />
      {helpText && !showRequiredError && (
        <span className="mt-1 block text-xs text-[var(--admin-text-4)]">{helpText}</span>
      )}
      {showRequiredError && (
        <span className="mt-1 block text-xs text-rose-500">Campo obrigatório</span>
      )}
    </label>
  );
}
