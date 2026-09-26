const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;' // or '&apos;'
};

export function escapeHtml(str: string | undefined): string | undefined {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, (match) => escapeMap[match]);
}
