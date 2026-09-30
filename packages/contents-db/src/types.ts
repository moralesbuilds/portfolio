export type Page<T> = {
  items?: T[];
  count: number;
  size: number;
};

export type Locale = "en" | "es";

export type BlogPostItem = {
  id: number;
  slug: string;
  title: string;
  summary?: string;
  publishedAt: string;
  category: string;
  tags?: string[];
  locale?: Locale;
};

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
  id?: number;
  name?: string;
  locale?: string;
  slug?: string;
  title?: string;
  summary?: string;
  repositoryUrl?: string;
  tags?: string[];
  isFeatured?: boolean;
  status?: "published" | "draft" | "archived";
  publishedAt?: string;
};
