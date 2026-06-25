export const adminPanelGridClass = 'grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6';
export const adminSectionGroupClass = 'space-y-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4 sm:p-5';
export const adminSectionItemClass = 'space-y-3 rounded-md border border-[var(--admin-border-sub)] bg-[var(--admin-surface)] p-4 shadow-sm';
export const adminFieldLabelClass = 'mb-2 block text-xs font-semibold uppercase tracking-widest text-[var(--admin-text-4)]';
export const adminSectionTitleClass = 'text-sm font-semibold text-[var(--admin-text-2)]';
export const adminMetaLabelClass = 'text-xs font-medium text-[var(--admin-text-4)]';
export const adminPrimaryGhostButtonClass = 'rounded-md bg-[var(--admin-active-bg)] px-3 py-2 text-xs font-semibold text-[var(--admin-active-text)] transition hover:opacity-80';
export const adminDangerButtonClass = 'rounded-md bg-[var(--admin-danger-bg)] px-3 py-2 text-xs font-semibold text-[var(--admin-danger-text)] transition hover:bg-[var(--admin-danger-bg-hover)]';
export const adminCheckboxClass = 'h-4 w-4 rounded border-[var(--admin-border-sub)] text-[var(--admin-accent)] focus:ring-[var(--admin-focus)]';

const baseInputClass = 'w-full rounded-md border bg-[var(--admin-input-bg)] text-sm text-[var(--admin-text-1)] shadow-sm outline-none transition focus:ring-2';

export function getAdminInputClass(isDirty: boolean) {
  return `${baseInputClass} h-10 px-3 ${isDirty
    ? 'border-amber-400 focus:border-amber-400 focus:ring-amber-400/20'
    : 'border-[var(--admin-input-bd)] focus:border-[var(--admin-accent)] focus:ring-[var(--admin-focus)]/20'}`;
}

export function getAdminTextareaClass(isDirty: boolean, minHeightClass = 'min-h-24') {
  return `${baseInputClass} ${minHeightClass} p-3 ${isDirty
    ? 'border-amber-400 focus:border-amber-400 focus:ring-amber-400/20'
    : 'border-[var(--admin-input-bd)] focus:border-[var(--admin-accent)] focus:ring-[var(--admin-focus)]/20'}`;
}

export function getAdminSelectClass(isDirty: boolean) {
  return getAdminInputClass(isDirty);
}
