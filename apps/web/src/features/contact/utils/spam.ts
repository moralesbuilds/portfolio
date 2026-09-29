const LINK_START = /https?:\/\/|(?<![\/.\w])www\./gi;

export function countLinks(text: string): number {
  return (text.match(LINK_START) ?? []).length;
}

export function hasTooManyLinks(text: string, maxLinks = 2): boolean {
  return countLinks(text) > maxLinks;
}
