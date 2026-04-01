const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const routesFile = path.join(rootDir, "src/routes.tsx");
const blogPostsFile = path.join(rootDir, "src/lib/blogPosts.ts");
const seoFile = path.join(rootDir, "src/lib/seo.ts");
const sitemapOutputFile = path.join(rootDir, "public/sitemap.xml");

function getSiteUrl() {
  const source = fs.readFileSync(seoFile, "utf8");
  const match = source.match(/export const SITE_URL = "([^"]+)"/);

  if (!match) {
    throw new Error("Unable to find SITE_URL in src/lib/seo.ts");
  }

  return match[1].replace(/\/+$/, "");
}

function getStaticRoutes() {
  const source = fs.readFileSync(routesFile, "utf8");
  const routeSet = new Set(["/"]);
  const pathMatches = source.matchAll(/path:\s*"([^"]+)"/g);

  for (const match of pathMatches) {
    const routePath = match[1];
    if (routePath === "*" || routePath.includes(":")) {
      continue;
    }

    routeSet.add(routePath.startsWith("/") ? routePath : `/${routePath}`);
  }

  return [...routeSet];
}

function getBlogPostRoutes() {
  const source = fs.readFileSync(blogPostsFile, "utf8");
  const slugMatches = source.matchAll(/slug:\s*"([^"]+)"/g);
  const routeSet = new Set();

  for (const match of slugMatches) {
    routeSet.add(`/post/${match[1]}`);
  }

  return [...routeSet];
}

function toIsoDate(date) {
  return date.toISOString().split("T")[0];
}

function toAbsoluteUrl(siteUrl, routePath) {
  if (routePath === "/") {
    return `${siteUrl}/`;
  }

  return `${siteUrl}${routePath}`;
}

function generateSitemapXml(siteUrl, routePaths) {
  const lastModified = toIsoDate(new Date());
  const sortedRoutes = [...new Set(routePaths)].sort((a, b) => a.localeCompare(b));

  const urlEntries = sortedRoutes
    .map((routePath) => {
      const absoluteUrl = toAbsoluteUrl(siteUrl, routePath);
      return [
        "  <url>",
        `    <loc>${absoluteUrl}</loc>`,
        `    <lastmod>${lastModified}</lastmod>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    "</urlset>",
    "",
  ].join("\n");
}

function main() {
  const siteUrl = getSiteUrl();
  const allRoutes = [...getStaticRoutes(), ...getBlogPostRoutes()];
  const xml = generateSitemapXml(siteUrl, allRoutes);

  fs.mkdirSync(path.dirname(sitemapOutputFile), { recursive: true });
  fs.writeFileSync(sitemapOutputFile, xml, "utf8");

  const urlCount = [...new Set(allRoutes)].length;
  console.log(`Generated sitemap.xml with ${urlCount} URLs.`);
}

main();
