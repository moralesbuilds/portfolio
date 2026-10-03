import { type BlogPostItem } from "@moralesbuilds/contents-db";

export function getBlogPostFilename(details: Partial<BlogPostItem>): string {
  return `blog_posts/${details.locale ?? 'en'}/${details.slug}.md`;
}
