import { AdminEditorCard } from '../shared/AdminEditorCard';
import {
  adminPanelGridClass,
  getAdminInputClass,
  getAdminTextareaClass,
} from '../shared/adminEditorStyles';

type I18nTextFieldProps = {
  label: string;
  pathPt: Array<string | number>;
  pathEn: Array<string | number>;
  valuePt: string;
  valueEn: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
  multiline?: boolean;
  rows?: number;
};

export function I18nTextField({
  label,
  pathPt,
  pathEn,
  valuePt,
  valueEn,
  isFieldDirty,
  onFieldChange,
  multiline = false,
  rows = 4,
}: I18nTextFieldProps) {
  return (
    <div className={adminPanelGridClass}>
      {([['pt', pathPt, valuePt], ['en', pathEn, valueEn]] as const).map(([lang, path, val]) => (
        <AdminEditorCard key={lang} title={`${label} (${lang.toUpperCase()})`}>
          {multiline ? (
            <textarea
              value={val as string}
              onChange={(e) => onFieldChange(path as Array<string | number>, e.target.value)}
              className={getAdminTextareaClass(isFieldDirty(path as Array<string | number>))}
              rows={rows}
            />
          ) : (
            <input
              type="text"
              value={val as string}
              onChange={(e) => onFieldChange(path as Array<string | number>, e.target.value)}
              className={getAdminInputClass(isFieldDirty(path as Array<string | number>))}
            />
          )}
        </AdminEditorCard>
      ))}
    </div>
  );
}
