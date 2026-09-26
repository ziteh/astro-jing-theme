# Astro Jing

A calm blog theme powered by [Astro](https://astro.build/).

Features:

- Auto-generate post descriptions based on character count or up to the `<!-- more -->` tag
- Auto-expanding & collapsing table of contents
- Open Graph image generation
- Full-text search
- Syntax highlighting
- Math equations
- Internationalization (i18n)
- Comment systems (Giscus / Disqus)
- Sitemap & RSS feed
- Static site

## Usage

```bash
pnpm i          # Install dependencies
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm preview    # Preview built site
```

### Using as a Git Submodule

This theme can be used as a git submodule in your own blog repo, keeping your content separate from theme updates.

project structure:

```text
my-blog/                  # Your blog repo
├── theme/                # astro-theme-jing (submodule)
│   ├── astro.config.ts
│   ├── content.config.ts
│   ├── package.json
│   ├── src/
│   ├── .env              # CONTENT_DIR=../content
│   └── ...
└── content/              # Your blog content
    ├── blog/
    │   └── post.md
    ├── about.md
    ├── site.config.json      # Optional, overrides src/config/site.ts
    ├── socials.config.json   # Optional, replaces src/config/socials.ts
    └── lang.config.json      # Optional, overrides src/config/lang.ts
```

```bash
cd my-blog
mkdir -p content/blog
touch content/about.md && touch content/blog/post.md
# Then edit the content files

git submodule add https://github.com/ziteh/astro-theme-jin theme
cd theme
echo "CONTENT_DIR=../content" > .env
pnpm i && pnpm build
```

`site.config.json`, `socials.config.json` and `lang.config.json` are optional and read from `CONTENT_DIR`, so your config stay outside the theme submodule too. Without them, the theme falls back to its own [defaults](src/config/).

> Currently, `astro.config.ts` cannot be overridden; if necessary, this may need to be handled through additional git operations.

for example:

```jsonc
// site.config.json
// any subset of the fields in src/config/site.ts
{ "title": "My Blog", "author": "Me", "url": "https://example.com" }
```

```jsonc
// socials.config.json
// replaces the whole list
[{ "href": "https://github.com/me", "title": "GitHub" }]
```

```jsonc
// lang.config.json
// any subset of the fields in src/config/lang.ts
// missing fields fall back to English
{
  "lang": "zh-TW",
  "langOg": "zh_TW",
  "timeZone": "Asia/Taipei",
  "posts": { "title": "文章", "desc": "所有文章" },
  "tags": { "title": "標籤", "desc": "所有標籤", "pageTitle": "標籤：{name}" },
  "categories": { "title": "分類", "desc": "所有分類", "pageTitle": "分類：{name}" },
  "search": { "title": "搜尋", "desc": "搜尋文章" },
  "about": { "title": "關於", "desc": "關於我" },
  "archives": {
    "title": "彙整",
    "desc": "所有文章",
    "totalZero": "目前沒有文章",
    "totalOne": "共 1 篇文章",
    "totalMany": "共 {count} 篇文章",
  },
  "notFound": { "title": "找不到頁面", "desc": "您要找的頁面不存在。" },
  "common": {
    "backToTop": "回到頂端",
    "viewAllPosts": "查看所有文章",
    "rssFeed": "訂閱 RSS",
    "featuredPost": "精選",
    "recentPost": "最新",
    "skipToMain": "跳到主要內容",
  },
  "pagination": { "next": "下一頁", "prev": "上一頁" },
  "date": { "postedOn": "發佈於 {date}" },
}
```

## Development

Tech stack:

- Colors: [Radix Colors](https://www.radix-ui.com/colors)
- Icons: [Tabler](https://tabler.io/icons)
- TOC: [Tocbot](https://tscanlin.github.io/tocbot/)
- Math: [KaTeX](https://katex.org/)
- OG image: [Satori](https://github.com/vercel/satori)
- Search: [astro-pagefind](https://github.com/shishkin/astro-pagefind)
- Syntax highlighting: [Expressive Code](https://expressive-code.com/)
- A11y testing: [axe-core](https://github.com/dequelabs/axe-core)
- Linter: [Biome](https://biomejs.dev/)
- Formatter: [Prettier](https://prettier.io/)

### Project Structure

Refer to [Astro project structure](https://docs.astro.build/en/basics/project-structure/).

```text
├── public/             # Unprocessed assets
├── tests/
├── src/
│   ├── config/
│   │   ├── site.ts     # Site config
│   │   ├── lang.ts     # I18n and locale config
│   │   └── socials.ts  # Social media links
│   ├── assets/
│   ├── content/
│   │   ├── blog/       # Markdown posts
│   │   └── about.md    # About page
│   ├── components/
│   ├── layouts/
│   ├── pages/          # Routes
│   ├── utils/
│   ├── styles/         # CSS
│   └── content.config.ts  # Content collection
├── astro.config.ts     # Astro config
├── package.json
└── README.md
```

## Testing

```bash
pnpm test       # All tests
pnpm test:lh    # Lighthouse
pnpm test:urls  # URLs
pnpm test:a11y  # Accessibility
```

### SEOnaut

```bash
pnpm seonaut:up
pnpm dev --host
```

Open <http://localhost:9000/signin> and enter <http://host.containers.internal:4321> as the target URL.

## Deploy

- [Cloudflare Pages build system](https://developers.cloudflare.com/pages/configuration/build-image/#languages-and-runtime)

Deployment platform support for [git submodules](#using-as-a-git-submodule) varies:

- **Netlify**: Supported, see [Git submodules](https://docs.netlify.com/build/git-workflows/repo-permissions-linking/#git-submodules).
- **Cloudflare Pages**: No built-in support. Build with GitHub Actions (checkout with `submodules: recursive`) and deploy the output with [cloudflare/wrangler-action](https://github.com/cloudflare/wrangler-action) instead.
