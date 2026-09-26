import type { APIRoute } from "astro";
import { SITE } from "@/config";
import getBlogPosts from "@/utils/getPosts";

export async function getStaticPaths() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!SITE.postMdUrl) {
    return new Response(null, { status: 404 });
  }

  const { post } = props;
  const title = post.data.title;
  const desc = post.data.description;
  const body = post.body;
  const date = post.data.date.toISOString();
  const updated = post.data.updated?.toISOString() || date;
  const tags = post.data.tags || [];
  const tagsStr = (tags as string[]).map((t) => `'${t}'`).join(", ");
  const categories = post.data.categories || [];
  const categoriesStr = (categories as string[]).map((c) => `'${c}'`).join(", ");

  const frontmatter = [
    `title: '${title}'`,
    `description: '${desc}'`,
    `created: ${date}`,
    updated !== date ? `updated: ${updated}` : null,
    tags.length > 0 ? `tags: [${tagsStr}]` : null,
    categories.length > 0 ? `categories: [${categoriesStr}]` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const mdContent = `---
${frontmatter}
---

${body}
`;

  return new Response(mdContent, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
