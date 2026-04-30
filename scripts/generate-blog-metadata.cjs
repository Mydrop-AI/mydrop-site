const fs = require("node:fs");
const path = require("node:path");
const { readBlogPosts } = require("./blog-content.cjs");

const rootDir = path.resolve(__dirname, "..");
const blogOrderFile = path.join(rootDir, "src", "generated", "blog-order.ts");
const outputFile = path.join(rootDir, "src", "generated", "blog-metadata.ts");

const AUTHOR_PROFILES = [
  {
    slug: "ariana-collins",
    name: "Ariana Collins",
    role: "Social Media Strategy Lead",
    image: "/images/authors/ariana-collins.png",
    bio: "Ariana Collins writes about content planning, campaign strategy, and the systems fast-moving teams need to stay consistent without sounding generic.",
  },
  {
    slug: "evan-blake",
    name: "Evan Blake",
    role: "Content Operations Editor",
    image: "/images/authors/evan-blake.png",
    bio: "Evan Blake focuses on approval workflows, publishing operations, and practical ways to make collaboration smoother across social, content, and client teams.",
  },
  {
    slug: "maya-chen",
    name: "Maya Chen",
    role: "Growth Content Editor",
    image: "/images/authors/maya-chen.png",
    bio: "Maya Chen covers analytics, audience growth, and AI-assisted marketing workflows, with an emphasis on advice teams can actually apply this week.",
  },
];

function readBlogOrderTimestamps() {
  if (!fs.existsSync(blogOrderFile)) {
    return {};
  }

  const source = fs.readFileSync(blogOrderFile, "utf8");
  const timestamps = {};

  for (const match of source.matchAll(/"([^"]+)":\s*(\d+),/g)) {
    timestamps[match[1]] = Number(match[2]);
  }

  return timestamps;
}

function buildReadTime(wordCount) {
  const readTimeMinutes = Math.max(1, Math.round(wordCount / 220));

  return {
    readTimeMinutes,
    readTimeLabel: `${readTimeMinutes} min read`,
  };
}

function sortPosts(posts) {
  return [...posts].sort((left, right) => {
    const publishedDiff =
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();

    if (publishedDiff !== 0) {
      return publishedDiff;
    }

    const updatedDiff =
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();

    if (updatedDiff !== 0) {
      return updatedDiff;
    }

    const createdDiff = right.createdAtTimestamp - left.createdAtTimestamp;

    if (createdDiff !== 0) {
      return createdDiff;
    }

    return left.title.localeCompare(right.title);
  });
}

function toMetadataPost(post, index) {
  const readTime = buildReadTime(post.wordCount);

  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    author: AUTHOR_PROFILES[index % AUTHOR_PROFILES.length],
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    heroImage: post.heroImage,
    heroImageAlt: post.heroImageAlt || post.title,
    heroCaption: post.heroCaption || "",
    featured: Boolean(post.featured),
    category: post.category,
    tags: post.tags,
    relatedSlugs: post.relatedSlugs,
    primaryCta: post.primaryCta,
    secondaryCta: post.secondaryCta,
    faq: post.faq,
    sources: post.sources,
    canonicalPath: post.canonicalPath,
    sourcePath: `../content/blog/${path.basename(post.sourcePath)}`,
    wordCount: post.wordCount,
    readTimeMinutes: readTime.readTimeMinutes,
    readTimeLabel: readTime.readTimeLabel,
    createdAtTimestamp: post.createdAtTimestamp,
  };
}

function main() {
  const blogOrderTimestamps = readBlogOrderTimestamps();
  const posts = readBlogPosts().map((post) => ({
    ...post,
    createdAtTimestamp: blogOrderTimestamps[post.slug] ?? 0,
  }));
  const metadataPosts = sortPosts(posts).map(toMetadataPost);
  const source = [
    "export const blogPostMetadata = ",
    JSON.stringify(metadataPosts, null, 2),
    " as const;",
    "",
  ].join("");

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, source, "utf8");

  console.log(`Generated blog metadata for ${metadataPosts.length} blog posts.`);
}

main();
