// cmsNormalize.ts — legacy v2 helpers, kept for reference but no longer used in v3.
export function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  return JSON.stringify(left) === JSON.stringify(right);
}

export function parsePathSegment(segment: string): string | number {
  return /^\d+$/.test(segment) ? Number(segment) : segment;
}
