/**
 * I18n language and locale configuration.
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "astro/zod";
import { CONTENT_DIR } from "./content-dir";

const langSchema = z
  .object({
    /** BCP 47 language tag, https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag */
    lang: z.string(),
    /** Open Graph locale tag (language_TERRITORY), https://ogp.me/#optional */
    langOg: z.string(),
    /** IANA time zone, https://timeapi.io/documentation/iana-timezones */
    timeZone: z.string(),
    posts: z.object({ title: z.string(), desc: z.string() }).partial(),
    tags: z.object({ title: z.string(), desc: z.string(), pageTitle: z.string() }).partial(),
    categories: z.object({ title: z.string(), desc: z.string(), pageTitle: z.string() }).partial(),
    search: z.object({ title: z.string(), desc: z.string() }).partial(),
    about: z.object({ title: z.string(), desc: z.string() }).partial(),
    archives: z
      .object({
        title: z.string(),
        desc: z.string(),
        totalZero: z.string(),
        totalOne: z.string(),
        totalMany: z.string(),
      })
      .partial(),
    notFound: z.object({ title: z.string(), desc: z.string() }).partial(),
    common: z
      .object({
        backToTop: z.string(),
        viewAllPosts: z.string(),
        rssFeed: z.string(),
        featuredPost: z.string(),
        recentPost: z.string(),
        skipToMain: z.string(),
      })
      .partial(),
    pagination: z.object({ next: z.string(), prev: z.string() }).partial(),
    date: z.object({ postedOn: z.string() }).partial(),
  })
  .partial();

type LangConfig = z.infer<typeof langSchema>;

const DEFAULT_LANG = {
  lang: "en",
  langOg: "en_US",
  timeZone: "America/New_York",
  posts: { title: "Posts", desc: "All posts" },
  tags: { title: "Tags", desc: "All tags", pageTitle: "Tag: {name}" },
  categories: { title: "Categories", desc: "All categories", pageTitle: "Category: {name}" },
  search: { title: "Search", desc: "Search posts" },
  about: { title: "About", desc: "About me" },
  archives: {
    title: "Archives",
    desc: "All posts",
    totalZero: "No posts yet",
    totalOne: "Total 1 post",
    totalMany: "Total {count} posts",
  },
  notFound: { title: "Page Not Found", desc: "The page you are looking for does not exist." },
  common: {
    backToTop: "Back to top",
    viewAllPosts: "View all posts",
    rssFeed: "Subscribe to RSS feed",
    featuredPost: "Featured",
    recentPost: "Recent",
    skipToMain: "Skip to main content",
  },
  pagination: { next: "Next", prev: "Prev" },
  date: { postedOn: "Posted on {date}" },
} satisfies Required<LangConfig>;

function loadOverride(): LangConfig {
  const overridePath = path.resolve(CONTENT_DIR, "lang.config.json");
  if (!fs.existsSync(overridePath)) return {};
  return langSchema.parse(JSON.parse(fs.readFileSync(overridePath, "utf-8")));
}

function mergeGroup<T extends object>(base: T, override: Partial<T> | undefined): T {
  const result = { ...base };
  for (const key in override) {
    const value = override[key];
    if (value !== undefined) result[key] = value;
  }
  return result;
}

function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

const override = loadOverride();
const t = {
  lang: override.lang ?? DEFAULT_LANG.lang,
  langOg: override.langOg ?? DEFAULT_LANG.langOg,
  timeZone: override.timeZone ?? DEFAULT_LANG.timeZone,
  posts: mergeGroup(DEFAULT_LANG.posts, override.posts),
  tags: mergeGroup(DEFAULT_LANG.tags, override.tags),
  categories: mergeGroup(DEFAULT_LANG.categories, override.categories),
  search: mergeGroup(DEFAULT_LANG.search, override.search),
  about: mergeGroup(DEFAULT_LANG.about, override.about),
  archives: mergeGroup(DEFAULT_LANG.archives, override.archives),
  notFound: mergeGroup(DEFAULT_LANG.notFound, override.notFound),
  common: mergeGroup(DEFAULT_LANG.common, override.common),
  pagination: mergeGroup(DEFAULT_LANG.pagination, override.pagination),
  date: mergeGroup(DEFAULT_LANG.date, override.date),
};

export const _t = {
  lang: t.lang,
  langOg: t.langOg,
  timeZone: t.timeZone,
  posts: t.posts,
  tags: {
    title: t.tags.title,
    desc: t.tags.desc,
    pageTitle(name: string): string {
      return interpolate(t.tags.pageTitle, { name });
    },
  },
  categories: {
    title: t.categories.title,
    desc: t.categories.desc,
    pageTitle(name: string): string {
      return interpolate(t.categories.pageTitle, { name });
    },
  },
  search: t.search,
  about: t.about,
  archives: {
    title: t.archives.title,
    desc: t.archives.desc,
    total(count: number): string {
      if (count === 0) return t.archives.totalZero;
      if (count === 1) return t.archives.totalOne;
      return interpolate(t.archives.totalMany, { count });
    },
  },
  notFound: t.notFound,
  common: t.common,
  pagination: t.pagination,
  date: {
    // Generic date formatting driven by `lang`/`timeZone`, no translated text involved.
    monthDay(date: Date): string {
      return date.toLocaleDateString(t.lang, {
        month: "short",
        day: "numeric",
        timeZone: t.timeZone,
      });
    },
    shortFormat(date: Date): string {
      return date.toLocaleDateString(t.lang, {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: t.timeZone,
      });
    },
    longFormat(date: Date): string {
      return date.toLocaleDateString(t.lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: t.timeZone,
      });
    },
    postedOn(date: string): string {
      return interpolate(t.date.postedOn, { date });
    },
  },
};
