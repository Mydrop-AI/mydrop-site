const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { readBlogAuthors, readBlogPosts } = require("./blog-content.cjs");

const rootDir = path.resolve(__dirname, "..");
const seoFile = path.join(rootDir, "src/lib/seo.ts");
const sitemapOutputFile = path.join(rootDir, "public/sitemap.xml");

const staticRouteFiles = [
  { path: "/", file: "src/pages/HomePage.tsx" },
  { path: "/pricing", file: "src/pages/PricingPage.tsx" },
  { path: "/privacy-policy", file: "src/pages/PrivacyPolicyPage.tsx" },
  { path: "/terms-and-services", file: "src/pages/TermsAndServicesPage.tsx" },
  { path: "/faq", file: "src/pages/FAQPage.tsx" },
  { path: "/contact", file: "src/pages/ContactPage.tsx" },
];

function getSiteUrl() {
  const source = fs.readFileSync(seoFile, "utf8");
  const match = source.match(/export const SITE_URL = "([^"]+)"/);

  if (!match) {
    throw new Error("Unable to find SITE_URL in src/lib/seo.ts");
  }

  return match[1].replace(/\/+$/, "");
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

function getFallbackLastModified(relativeFilePath) {
  const absoluteFilePath = path.join(rootDir, relativeFilePath);
  const stats = fs.statSync(absoluteFilePath);
  return toIsoDate(stats.mtime);
}

function getGitLastModified(relativeFilePath) {
  try {
    const output = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", relativeFilePath],
      {
        cwd: rootDir,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();

    if (output) {
      return output;
    }
  } catch (_error) {
    // Fall through to filesystem-based fallback.
  }

  return getFallbackLastModified(relativeFilePath);
}

function getBlogIndexLastModified(posts) {
  const pageDate = getGitLastModified("src/pages/BlogPage.tsx");
  const latestPostDate = posts.reduce((latest, post) => {
    return latest > post.updatedAt ? latest : post.updatedAt;
  }, pageDate);

  return latestPostDate > pageDate ? latestPostDate : pageDate;
}

function generateSitemapXml(siteUrl, routeEntries) {
  const sortedEntries = [...routeEntries]
    .sort((left, right) => left.path.localeCompare(right.path))
    .filter((entry, index, entries) => entries.findIndex((candidate) => candidate.path === entry.path) === index);

  const urlEntries = sortedEntries
    .map((entry) => {
      const absoluteUrl = toAbsoluteUrl(siteUrl, entry.path);
      return [
        "  <url>",
        `    <loc>${absoluteUrl}</loc>`,
        `    <lastmod>${entry.lastModified}</lastmod>`,
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
  const blogPosts = readBlogPosts();
  const blogAuthors = readBlogAuthors();

  const routeEntries = [
    ...staticRouteFiles.map((route) => ({
      path: route.path,
      lastModified: getGitLastModified(route.file),
    })),
    {
      path: "/blog",
      lastModified: getBlogIndexLastModified(blogPosts),
    },
    ...blogAuthors.map((author) => ({
      path: `/authors/${author.slug}`,
      lastModified: author.posts.reduce((latest, post) => {
        return latest > post.updatedAt ? latest : post.updatedAt;
      }, "1970-01-01"),
    })),
    ...blogPosts.map((post) => ({
      path: post.canonicalPath,
      lastModified: post.updatedAt,
    })),
  ];

  const xml = generateSitemapXml(siteUrl, routeEntries);

  fs.mkdirSync(path.dirname(sitemapOutputFile), { recursive: true });
  fs.writeFileSync(sitemapOutputFile, xml, "utf8");

  console.log(`Generated sitemap.xml with ${routeEntries.length} URLs.`);
}

main();
