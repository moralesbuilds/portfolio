export function toLocalDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, { dateStyle: 'medium' });
}
