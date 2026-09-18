import { BlogPostItem } from "@moralesbuilds/contents-db";

export function getBlogPostFilename(details: BlogPostItem) {
  return `${details.locale ?? 'en'}/${details.slug}.md`;
}
