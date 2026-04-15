const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "src", "content", "blog");

const FRONTMATTER_PATTERN = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/;
const DEFAULT_PRIMARY_CTA = {
  label: "Start with Mydrop",
  href: "https://app.mydropai.com/register",
};
const DEFAULT_SECONDARY_CTA = {
  label: "Talk to the team",
  href: "/contact",
};
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

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtmlTags(value) {
  return value.replace(/<[^>]+>/g, " ");
}

function stripMarkdownSyntax(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+]\([^)]+\)/g, " ")
    .replace(/^>\s+/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ");
}

function countWords(markdown) {
  const plainText = stripMarkdownSyntax(stripHtmlTags(markdown))
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return 0;
  }

  return plainText.split(" ").length;
}

function parseFrontmatter(source, filePath) {
  const match = source.match(FRONTMATTER_PATTERN);

  if (!match) {
    throw new Error(`Missing JSON frontmatter in ${filePath}`);
  }

  const [, rawFrontmatter, markdown] = match;

  let frontmatter;

  try {
    frontmatter = JSON.parse(rawFrontmatter);
  } catch (error) {
    throw new Error(
      `Invalid JSON frontmatter in ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  return {
    frontmatter,
    markdown: markdown.trim(),
  };
}

function getBlogFiles() {
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  return fs
    .readdirSync(blogDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .filter((fileName) => !fileName.startsWith("_"))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => path.join(blogDir, fileName));
}

function normalizeBlogPost(frontmatter, markdown, filePath) {
  if (!frontmatter.slug || !frontmatter.title || !frontmatter.description) {
    throw new Error(`Missing required post metadata in ${filePath}`);
  }

  if (!frontmatter.author?.name || !frontmatter.author?.role) {
    throw new Error(`Missing author metadata in ${filePath}`);
  }

  return {
    ...frontmatter,
    updatedAt: frontmatter.updatedAt || frontmatter.publishedAt,
    author: {
      ...frontmatter.author,
      slug: frontmatter.author.slug || slugify(frontmatter.author.name),
    },
    featured: Boolean(frontmatter.featured),
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    relatedSlugs: Array.isArray(frontmatter.relatedSlugs) ? frontmatter.relatedSlugs : [],
    faq: Array.isArray(frontmatter.faq) ? frontmatter.faq : [],
    sources: Array.isArray(frontmatter.sources) ? frontmatter.sources : [],
    primaryCta:
      frontmatter.primaryCta?.label && frontmatter.primaryCta?.href
        ? frontmatter.primaryCta
        : DEFAULT_PRIMARY_CTA,
    secondaryCta:
      frontmatter.secondaryCta?.label && frontmatter.secondaryCta?.href
        ? frontmatter.secondaryCta
        : DEFAULT_SECONDARY_CTA,
    canonicalPath: `/post/${frontmatter.slug}`,
    markdown,
    sourcePath: filePath,
    wordCount: countWords(markdown),
  };
}

function getAuthorProfileForIndex(index) {
  return {
    ...AUTHOR_PROFILES[index % AUTHOR_PROFILES.length],
  };
}

function sortPosts(posts) {
  return [...posts].sort((left, right) => {
    const publishedDiff = new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();

    if (publishedDiff !== 0) {
      return publishedDiff;
    }

    const updatedDiff = new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();

    if (updatedDiff !== 0) {
      return updatedDiff;
    }

    return left.title.localeCompare(right.title);
  });
}

function readBlogPosts() {
  return sortPosts(
    getBlogFiles().map((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const { frontmatter, markdown } = parseFrontmatter(source, filePath);
      return normalizeBlogPost(frontmatter, markdown, filePath);
    }),
  ).map((post, index) => ({
    ...post,
    author: getAuthorProfileForIndex(index),
  }));
}

function readBlogAuthors() {
  const authorsBySlug = new Map();

  for (const post of readBlogPosts()) {
    const existingAuthor = authorsBySlug.get(post.author.slug);

    if (existingAuthor) {
      existingAuthor.posts.push(post);
      continue;
    }

    authorsBySlug.set(post.author.slug, {
      ...post.author,
      bio: post.author.bio,
      posts: [post],
    });
  }

  return [...authorsBySlug.values()].sort((left, right) => left.name.localeCompare(right.name));
}

module.exports = {
  blogDir,
  countWords,
  getBlogFiles,
  parseFrontmatter,
  readBlogAuthors,
  readBlogPosts,
  slugify,
};
