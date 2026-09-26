/**
 * Social media links configuration.
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "astro/zod";
import { CONTENT_DIR } from "./content-dir";

// Without using git submodule, the `.default()` value can be modified directly
// When using git submodule, the whole list can be overridden from `<CONTENT_DIR>/socials.config.json`
const socialsSchema = z
  .array(
    z.object({
      href: z.string(),
      title: z.string(),
    }),
  )
  .default([
    {
      href: "https://www.youtube.com",
      title: "YouTube",
    },
    {
      href: "https://github.com/ziteh/astro-theme-jing",
      title: "GitHub",
    },
    {
      href: "/rss.xml",
      title: "RSS",
    },
  ]);

function loadRawOverride() {
  const overridePath = path.resolve(CONTENT_DIR, "socials.config.json");
  if (!fs.existsSync(overridePath)) return undefined;
  return JSON.parse(fs.readFileSync(overridePath, "utf-8"));
}

export const SOCIALS = socialsSchema.parse(loadRawOverride());
