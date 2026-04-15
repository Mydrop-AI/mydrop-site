import { marked } from "marked";
import { resolveAssetPath } from "@/lib/paths";

export interface BlogAuthor {
  name: string;
  role: string;
  slug: string;
  bio?: string;
}

export interface BlogAuthorProfile extends BlogAuthor {
  bio: string;
  posts: BlogPost[];
}

export interface BlogCta {
  label: string;
  href: string;
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogSourceItem {
  title: string;
  url: string;
  publisher?: string;
}

export interface BlogPostFrontmatter {
  slug: string;
  title: string;
  description: string;
  author: BlogAuthor;
  publishedAt: string;
  updatedAt?: string;
  heroImage: string;
  heroImageAlt: string;
  heroCaption?: string;
  featured?: boolean;
  category: string;
  tags: string[];
  relatedSlugs?: string[];
  primaryCta?: BlogCta;
  secondaryCta?: BlogCta;
  faq?: BlogFaqItem[];
  sources?: BlogSourceItem[];
}

export interface BlogPost
  extends Omit<
    BlogPostFrontmatter,
    "updatedAt" | "featured" | "relatedSlugs" | "primaryCta" | "secondaryCta" | "faq" | "sources"
  > {
  featured: boolean;
  relatedSlugs: string[];
  primaryCta: BlogCta;
  secondaryCta: BlogCta;
  faq: BlogFaqItem[];
  sources: BlogSourceItem[];
  updatedAt: string;
  canonicalPath: string;
  html: string;
  markdown: string;
  wordCount: number;
  readTimeMinutes: number;
  readTimeLabel: string;
  sourcePath: string;
}

const DEFAULT_PRIMARY_CTA: BlogCta = {
  label: "Start with Mydrop",
  href: "https://app.mydropai.com/register",
};

const DEFAULT_SECONDARY_CTA: BlogCta = {
  label: "Talk to the team",
  href: "/contact",
};

const FRONTMATTER_PATTERN = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrontmatter(source: string, filePath: string) {
  const match = source.match(FRONTMATTER_PATTERN);

  if (!match) {
    throw new Error(`Missing JSON frontmatter in ${filePath}`);
  }

  const [, rawFrontmatter, markdown] = match;

  let frontmatter: BlogPostFrontmatter;

  try {
    frontmatter = JSON.parse(rawFrontmatter) as BlogPostFrontmatter;
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

function stripHtmlTags(value: string) {
  return value.replace(/<[^>]+>/g, " ");
}

function stripMarkdownSyntax(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+]\([^)]+\)/g, " ")
    .replace(/^>\s+/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ");
}

function countWords(markdown: string) {
  const plainText = stripMarkdownSyntax(stripHtmlTags(markdown))
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return 0;
  }

  return plainText.split(" ").length;
}

function buildReadTimeLabel(wordCount: number) {
  const readTimeMinutes = Math.max(1, Math.round(wordCount / 220));
  return {
    readTimeMinutes,
    readTimeLabel: `${readTimeMinutes} min read`,
  };
}

function rewriteRootRelativeUrls(html: string) {
  return html.replace(/\b(href|src)="(\/[^"]*)"/g, (_match, attribute, url) => {
    return `${attribute}="${resolveAssetPath(url)}"`;
  });
}

function normalizeAuthor(author: BlogAuthor | undefined, title: string) {
  if (!author?.name || !author?.role) {
    throw new Error(`Missing author metadata for "${title}"`);
  }

  return {
    ...author,
    slug: author.slug || slugify(author.name),
  };
}

function buildAuthorBio(name: string, role: string, bio?: string) {
  return (
    bio ||
    `${name} is part of the Mydrop editorial team, focused on practical social media systems, content operations, and AI-assisted marketing workflows.`
  );
}

function normalizeCta(cta: BlogCta | undefined, fallback: BlogCta) {
  if (!cta?.label || !cta?.href) {
    return fallback;
  }

  return cta;
}

function createBlogPost(frontmatter: BlogPostFrontmatter, markdown: string, sourcePath: string): BlogPost {
  if (!frontmatter.slug || !frontmatter.title || !frontmatter.description) {
    throw new Error(`Missing required post metadata in ${sourcePath}`);
  }

  const updatedAt = frontmatter.updatedAt || frontmatter.publishedAt;
  const wordCount = countWords(markdown);
  const readTime = buildReadTimeLabel(wordCount);
  const html = rewriteRootRelativeUrls(String(marked.parse(markdown)));

  return {
    ...frontmatter,
    author: normalizeAuthor(frontmatter.author, frontmatter.title),
    updatedAt,
    heroCaption: frontmatter.heroCaption || "",
    featured: Boolean(frontmatter.featured),
    tags: frontmatter.tags ?? [],
    relatedSlugs: frontmatter.relatedSlugs ?? [],
    primaryCta: normalizeCta(frontmatter.primaryCta, DEFAULT_PRIMARY_CTA),
    secondaryCta: normalizeCta(frontmatter.secondaryCta, DEFAULT_SECONDARY_CTA),
    faq: frontmatter.faq ?? [],
    sources: frontmatter.sources ?? [],
    canonicalPath: `/post/${frontmatter.slug}`,
    html,
    markdown,
    wordCount,
    readTimeMinutes: readTime.readTimeMinutes,
    readTimeLabel: readTime.readTimeLabel,
    sourcePath,
  };
}

function sortPosts(posts: BlogPost[]) {
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

    return left.title.localeCompare(right.title);
  });
}

const blogPostModules = import.meta.glob("../content/blog/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export const blogPosts: BlogPost[] = sortPosts(
  Object.entries(blogPostModules)
    .filter(([filePath]) => !filePath.split("/").pop()?.startsWith("_"))
    .map(([filePath, source]) => {
      const { frontmatter, markdown } = parseFrontmatter(source, filePath);
      return createBlogPost(frontmatter, markdown, filePath);
    }),
);

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedBlogPost() {
  return blogPosts[0] ?? null;
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  const explicitRelatedPosts = post.relatedSlugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter((candidate): candidate is BlogPost => Boolean(candidate));

  if (explicitRelatedPosts.length > 0) {
    return explicitRelatedPosts.slice(0, limit);
  }

  return blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      let score = 0;

      if (candidate.category === post.category) {
        score += 3;
      }

      for (const tag of candidate.tags) {
        if (post.tags.includes(tag)) {
          score += 1;
        }
      }

      return { candidate, score };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return (
        new Date(right.candidate.publishedAt).getTime() -
        new Date(left.candidate.publishedAt).getTime()
      );
    })
    .map(({ candidate }) => candidate)
    .slice(0, limit);
}

export function getLatestBlogUpdatedAt() {
  return blogPosts.reduce((latest, post) => {
    return latest > post.updatedAt ? latest : post.updatedAt;
  }, "1970-01-01");
}

export function getBlogAuthors(): BlogAuthorProfile[] {
  const authorsBySlug = new Map<string, BlogAuthorProfile>();

  for (const post of blogPosts) {
    const existingAuthor = authorsBySlug.get(post.author.slug);
    const bio = buildAuthorBio(post.author.name, post.author.role, post.author.bio);

    if (existingAuthor) {
      existingAuthor.posts.push(post);
      continue;
    }

    authorsBySlug.set(post.author.slug, {
      ...post.author,
      bio,
      posts: [post],
    });
  }

  return [...authorsBySlug.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function getBlogAuthorBySlug(slug: string) {
  return getBlogAuthors().find((author) => author.slug === slug);
}
