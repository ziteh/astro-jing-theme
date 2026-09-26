/**
 * Basic site configuration.
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "astro/zod";
import { CONTENT_DIR } from "./content-dir";

// Without using git submodule, the `.default()` value can be modified directly
// When using git submodule, any subset of these fields can be overridden from `<CONTENT_DIR>/site.config.json`
const siteSchema = z.object({
  // Basic information
  url: z.string().default("https://astro-theme-jing.ziteh.dev"), // Your site's URL, e.g. https://username.github.io
  title: z.string().default("Astro Jing"), // Your blog title
  description: z.string().default("A calm Astro theme for blogging."), // Your blog description
  author: z.string().default("ZiTe"), // 君の名は ~

  // Pagination
  postsPerHomepage: z.number().default(3),
  postsPerArchives: z.number().default(3),
  postsPerAllPosts: z.number().default(5),

  // Description generation
  getDescriptionCount: z.number().default(150), // If 'more' tag is not found, use this count of characters
  getDescriptionMaxLines: z.number().default(10), // Max number of lines to process

  // Default values for frontmatter fields
  defaultFmTag: z.string().default("Others"),
  defaultFmCategory: z.string().default(""),
  defaultFmToc: z.boolean().default(false),
  defaultFmComments: z.boolean().default(false),
  defaultFmMath: z.boolean().default(false),

  // View transitions (https://docs.astro.build/en/guides/view-transitions/)
  transitions: z.boolean().default(true),

  // Disqus comments
  disqusShortname: z.string().default(""), // Shortname (without https:// and .disqus.com)

  // Giscus comments
  giscusRepo: z.string().default(""), // e.g. "user/repo"
  giscusRepoId: z.string().default(""),
  giscusCategory: z.string().default(""),
  giscusCategoryId: z.string().default(""),
  giscusMapping: z.string().default("title"),
  giscusStrict: z.string().default("0"),
  giscusReactionsEnabled: z.string().default("1"),
  giscusEmitMetadata: z.string().default("0"),
  giscusInputPosition: z.string().default("bottom"),
  giscusTheme: z.string().default("preferred_color_scheme"),
});

function loadRawOverride() {
  const overridePath = path.resolve(CONTENT_DIR, "site.config.json");
  if (!fs.existsSync(overridePath)) return {};
  return JSON.parse(fs.readFileSync(overridePath, "utf-8"));
}

export const SITE = siteSchema.parse(loadRawOverride());
