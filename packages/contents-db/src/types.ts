export type Page<T> = {
  items?: T[];
  count: number;
  size: number;
};

export type Locale = "en" | "es";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  summary?: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags?: string[];
  locale: Locale;
};

export type BlogPostItem = Pick<BlogPost, "id" | "slug" | "title" | "summary" | "publishedAt" | "category">;
export type LatestBlogPost = Pick<BlogPost, "id" | "title" | "publishedAt" | "slug">;
export type RelatedBlogPost = Pick<BlogPost, "id" | "title" | "publishedAt" | "slug">;

export type LeadStatus =  "new" | "read" | "archived";
export type Lead = {
  id: number;
  leadSourceId: number;
  name: string;
  email: string;
  message: string;
  status: LeadStatus;
  locale: Locale;
  ipAddress: string;
  isSpam: 0 | 1;
  createdAt: string;
};

export interface RateLimitStore {
  record(key: string, now: number): Promise<void>;
  countSince(key: string, since: number): Promise<number>;
  prune(before: number): Promise<void>;
};

export type Project = {
  id: number;
  name: string;
  locale: string;
  slug: string;
  title: string;
  summary: string;
  repositoryUrl?: string;
  tags?: string[];
  isFeatured: boolean;
  status: "published" | "draft" | "archived";
  publishedAt: string;
  updatedAt?: string;
  relatedBlogPosts?: RelatedBlogPost[];
};

export type ProjectItem = Pick<Project, "id" | "slug" | "title" | "summary" | "publishedAt" | "tags" | "isFeatured">;

export type BlogPostSitemapEntry = {
  slug: string;
  lastModified: string;
  alternates: Record<Locale, string>;
};

export type ProjectSitemapEntry = {
  slug: string;
  lastModified: string;
  alternates: Record<Locale, string>;
};
