export type Locale = "en" | "es";

export type BlogPostItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  category: string
};
