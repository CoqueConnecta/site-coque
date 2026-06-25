import { AdminEditorCard } from '../shared/AdminEditorCard';
import { RichTextEditor } from '../shared/RichTextEditor';
import { adminPanelGridClass } from '../shared/adminEditorStyles';

type I18nRichTextFieldProps = {
  label: string;
  pathPt: Array<string | number>;
  pathEn: Array<string | number>;
  valuePt: string;
  valueEn: string;
  isFieldDirty: (path: Array<string | number>) => boolean;
  onFieldChange: (path: Array<string | number>, value: unknown) => void;
};

export function I18nRichTextField({
  label,
  pathPt,
  pathEn,
  valuePt,
  valueEn,
  isFieldDirty,
  onFieldChange,
}: I18nRichTextFieldProps) {
  return (
    <div className={adminPanelGridClass}>
      {([['pt', pathPt, valuePt], ['en', pathEn, valueEn]] as const).map(([lang, path, val]) => (
        <AdminEditorCard key={lang} title={`${label} (${lang.toUpperCase()})`}>
          <RichTextEditor
            value={val as string}
            onChange={(md) => onFieldChange(path as Array<string | number>, md)}
            isDirty={isFieldDirty(path as Array<string | number>)}
            ariaLabel={`${label} (${lang.toUpperCase()})`}
          />
        </AdminEditorCard>
      ))}
    </div>
  );
}
