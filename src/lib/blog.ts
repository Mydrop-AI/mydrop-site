import { blogPostMetadata } from "@/generated/blog-metadata";
import { resolveAssetPath } from "@/lib/paths";

export interface BlogAuthor {
  name: string;
  role: string;
  slug: string;
  bio?: string;
  image: string;
}

export interface BlogAuthorFrontmatter {
  name: string;
  role: string;
  slug?: string;
  bio?: string;
}

export interface BlogAuthorProfile extends BlogAuthor {
  bio: string;
  posts: BlogPostSummary[];
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
  author: BlogAuthorFrontmatter;
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

export interface BlogPostSummary
  extends Omit<
    BlogPostFrontmatter,
    "author" | "updatedAt" | "featured" | "relatedSlugs" | "primaryCta" | "secondaryCta" | "faq" | "sources"
  > {
  author: BlogAuthor;
  featured: boolean;
  relatedSlugs: string[];
  primaryCta: BlogCta;
  secondaryCta: BlogCta;
  faq: BlogFaqItem[];
  sources: BlogSourceItem[];
  updatedAt: string;
  canonicalPath: string;
  sourcePath: string;
  wordCount: number;
  readTimeMinutes: number;
  readTimeLabel: string;
  createdAtTimestamp: number;
}

export interface BlogPost extends BlogPostSummary {
  html: string;
  markdown: string;
}

const FRONTMATTER_PATTERN = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/;

function parseFrontmatter(source: string, filePath: string) {
  const match = source.match(FRONTMATTER_PATTERN);

  if (!match) {
    throw new Error(`Missing JSON frontmatter in ${filePath}`);
  }

  const [, rawFrontmatter, markdown] = match;

  try {
    JSON.parse(rawFrontmatter) as BlogPostFrontmatter;
  } catch (error) {
    throw new Error(
      `Invalid JSON frontmatter in ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  return {
    markdown: markdown.trim(),
  };
}

function validateRawImageTag(tag: string) {
  let index = tag.indexOf("img") + 3;

  while (index < tag.length) {
    while (index < tag.length && /\s/.test(tag[index])) {
      index += 1;
    }

    if (index >= tag.length || tag[index] === ">") {
      return null;
    }

    if (tag[index] === "/" && tag[index + 1] === ">") {
      return null;
    }

    if (tag[index] === '"' || tag[index] === "'") {
      return 'unexpected quote while parsing <img> attributes; escape embedded quotes as &quot; or rewrite the attribute text';
    }

    if (!/[A-Za-z_:]/.test(tag[index])) {
      return `unexpected character "${tag[index]}" while parsing <img> attributes`;
    }

    index += 1;
    while (index < tag.length && /[A-Za-z0-9:._-]/.test(tag[index])) {
      index += 1;
    }

    while (index < tag.length && /\s/.test(tag[index])) {
      index += 1;
    }

    if (tag[index] !== "=") {
      continue;
    }

    index += 1;
    while (index < tag.length && /\s/.test(tag[index])) {
      index += 1;
    }

    if (index >= tag.length) {
      return "missing attribute value in <img> tag";
    }

    const quote = tag[index];
    if (quote === '"' || quote === "'") {
      index += 1;
      const closingIndex = tag.indexOf(quote, index);

      if (closingIndex === -1) {
        return `missing closing ${quote} for an <img> attribute`;
      }

      index = closingIndex + 1;
      continue;
    }

    while (index < tag.length && !/[\s>]/.test(tag[index])) {
      index += 1;
    }
  }

  return null;
}

function validateRawHtmlImageTags(markdown: string, filePath: string) {
  const matches = markdown.matchAll(/<img\b[\s\S]*?>/g);

  for (const match of matches) {
    const tag = match[0];
    const error = validateRawImageTag(tag);

    if (!error) {
      continue;
    }

    const lineNumber = markdown.slice(0, match.index).split(/\r?\n/).length;
    throw new Error(`Invalid raw <img> HTML in ${filePath}:${lineNumber} - ${error}`);
  }
}

function rewriteRootRelativeUrls(html: string) {
  return html.replace(/\b(href|src)="(\/[^"]*)"/g, (_match, attribute, url) => {
    return `${attribute}="${resolveAssetPath(url)}"`;
  });
}

function clonePostSummary(post: (typeof blogPostMetadata)[number]): BlogPostSummary {
  return {
    ...post,
    author: { ...post.author },
    tags: [...post.tags],
    relatedSlugs: [...post.relatedSlugs],
    primaryCta: { ...post.primaryCta },
    secondaryCta: { ...post.secondaryCta },
    faq: post.faq.map((item) => ({ ...item })),
    sources: post.sources.map((item) => ({ ...item })),
  };
}

export const blogPosts: BlogPostSummary[] = blogPostMetadata.map(clonePostSummary);

const blogPostModules = import.meta.glob("../content/blog/*.md", {
  import: "default",
  query: "?raw",
}) as Record<string, () => Promise<string>>;

const blogPostCache = new Map<string, Promise<BlogPost | null>>();

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export const getBlogPostSummaryBySlug = getBlogPostBySlug;

export async function loadBlogPostBySlug(slug: string) {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const cachedPost = blogPostCache.get(normalizedSlug);
  if (cachedPost) {
    return cachedPost;
  }

  const postPromise = loadBlogPost(normalizedSlug);
  blogPostCache.set(normalizedSlug, postPromise);
  return postPromise;
}

async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  const summary = getBlogPostBySlug(slug);
  const sourcePath = summary?.sourcePath ?? `../content/blog/${slug}.md`;
  const loadSource = blogPostModules[sourcePath];

  if (!summary || !loadSource) {
    return null;
  }

  const source = await loadSource();
  const { markdown } = parseFrontmatter(source, sourcePath);
  validateRawHtmlImageTags(markdown, sourcePath);

  const { marked } = await import("marked");
  const html = rewriteRootRelativeUrls(String(await marked.parse(markdown)));

  return {
    ...summary,
    html,
    markdown,
    sourcePath,
  };
}

export function getFeaturedBlogPost() {
  return blogPosts[0] ?? null;
}

export function getRelatedBlogPosts(post: BlogPostSummary, limit = 3) {
  const explicitRelatedPosts = post.relatedSlugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter((candidate): candidate is BlogPostSummary => Boolean(candidate));

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
    const bio = post.author.bio || "";

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
  return getBlogAuthors().find((author) => author.slug === slug) ?? null;
}
