export const adminPanelGridClass = 'grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6';
export const adminSectionGroupClass = 'space-y-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:p-5';
export const adminSectionItemClass = 'space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-100/70';
export const adminFieldLabelClass = 'mb-2 block text-sm font-semibold text-gray-700';
export const adminSectionTitleClass = 'text-sm font-semibold text-gray-700';
export const adminMetaLabelClass = 'text-xs font-semibold uppercase tracking-[0.16em] text-gray-400';
export const adminPrimaryGhostButtonClass = 'rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100';
export const adminDangerButtonClass = 'rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100';
export const adminCheckboxClass = 'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500';

const baseInputClass = 'w-full rounded-xl border bg-white text-sm text-gray-800 shadow-sm outline-none transition focus:ring-4';

export function getAdminInputClass(isDirty: boolean) {
  return `${baseInputClass} h-11 px-3.5 ${isDirty
    ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-100'
    : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-100'}`;
}

export function getAdminTextareaClass(isDirty: boolean, minHeightClass = 'min-h-24') {
  return `${baseInputClass} ${minHeightClass} p-3.5 ${isDirty
    ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-100'
    : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-100'}`;
}

export function getAdminSelectClass(isDirty: boolean) {
  return getAdminInputClass(isDirty);
}
