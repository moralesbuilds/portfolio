import { type BlogPost } from "@moralesbuilds/contents-db";

export function getBlogPostFilename(details: Partial<BlogPost>): string {
  return `blog_posts/${details.locale ?? 'en'}/${details.slug}.md`;
}
