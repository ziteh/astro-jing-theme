export const getCanonicalURL = (url: URL, site: URL | undefined): string => {
  const pathname = url.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  return new URL(pathname, site).toString().replace(/\/$/, "");
};

export const getMarkdownURL = (canonicalURL: string): string => {
  const url = new URL(canonicalURL);
  url.pathname = `${url.pathname.replace(/\/$/, "")}.md`;
  return url.toString();
};
