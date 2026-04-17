const fs = require("node:fs");
const path = require("node:path");
const { readBlogPosts } = require("./blog-content.cjs");

const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const MIN_WORD_COUNT = 3000;
const MAX_WORD_COUNT = 4500;
const STALE_TONE_PATTERNS = [
  /in today['’]s digital world/gi,
  /in today['’]s fast-paced digital landscape/gi,
  /it is essential to/gi,
  /this article will explore/gi,
  /this article explores/gi,
  /this guide will explore/gi,
  /in conclusion[, ]/gi,
  /in the modern era/gi,
  /leverage\b/gi,
  /delve into/gi,
];

function countSectionHeadings(markdown) {
  const markdownHeadings = markdown.match(/^##\s+/gm) ?? [];
  const htmlHeadings = markdown.match(/<h2[\s>]/g) ?? [];
  return markdownHeadings.length + htmlHeadings.length;
}

function hasTopLevelHeading(markdown) {
  return /^#\s+/m.test(markdown) || /<h1[\s>]/i.test(markdown);
}

function countRepeatedHeadings(markdown) {
  const headingMatches = markdown.match(/^#{2,6}\s+.+$/gm) ?? [];
  const counts = new Map();

  for (const heading of headingMatches.map((value) => value.trim())) {
    counts.set(heading, (counts.get(heading) ?? 0) + 1);
  }

  return Math.max(0, ...counts.values());
}

function countRepeatedParagraphs(markdown) {
  const paragraphs = markdown
    .split(/\n\s*\n/g)
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter((value) => value.length >= 140);
  const counts = new Map();

  for (const paragraph of paragraphs) {
    counts.set(paragraph, (counts.get(paragraph) ?? 0) + 1);
  }

  return Math.max(0, ...counts.values());
}

function findStaleToneHits(markdown) {
  const hits = [];

  for (const pattern of STALE_TONE_PATTERNS) {
    const matches = markdown.match(pattern) ?? [];
    if (matches.length > 0) {
      hits.push({
        pattern: pattern.source,
        count: matches.length,
        sample: matches[0],
      });
    }
  }

  return hits;
}

function hasFaqSection(markdown) {
  return /^(##|###)\s+(faq|common questions)\s*$/gim.test(markdown);
}

function hasEmptyReferencesSection(markdown) {
  const lines = markdown.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    if (!/^(##|###)\s+(sources|references)\s*$/i.test(lines[index].trim())) {
      continue;
    }

    let body = "";
    for (let next = index + 1; next < lines.length; next += 1) {
      if (/^##\s+/.test(lines[next])) {
        break;
      }
      body += `${lines[next]}\n`;
    }

    const normalized = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (normalized === "" || /^(references|sources)$/i.test(normalized)) {
      return true;
    }
  }

  return false;
}

function findMissingBodyImagePaths(markdown) {
  const matches = [...markdown.matchAll(/<img[^>]+src="([^"]+)"/g)];
  const missing = [];

  for (const match of matches) {
    const src = match[1];
    if (!src.startsWith("/")) {
      continue;
    }
    const absolutePath = path.join(publicDir, src.replace(/^\/+/, ""));
    if (!fs.existsSync(absolutePath)) {
      missing.push(src);
    }
  }

  return missing;
}

function validate() {
  const posts = readBlogPosts();
  const errors = [];
  const warnings = [];

  const seenSlugs = new Set();
  const seenTitles = new Set();

  for (const post of posts) {
    if (seenSlugs.has(post.slug)) {
      errors.push(`Duplicate slug "${post.slug}"`);
    }
    seenSlugs.add(post.slug);

    if (seenTitles.has(post.title)) {
      errors.push(`Duplicate title "${post.title}"`);
    }
    seenTitles.add(post.title);

    if (!isoDatePattern.test(post.publishedAt)) {
      errors.push(`${post.slug}: publishedAt must use YYYY-MM-DD`);
    }

    if (!isoDatePattern.test(post.updatedAt)) {
      errors.push(`${post.slug}: updatedAt must use YYYY-MM-DD`);
    }

    if (post.updatedAt < post.publishedAt) {
      errors.push(`${post.slug}: updatedAt cannot be earlier than publishedAt`);
    }

    if (!post.category) {
      errors.push(`${post.slug}: category is required`);
    }

    if (!Array.isArray(post.tags) || post.tags.length < 2) {
      errors.push(`${post.slug}: add at least 2 tags`);
    }

    if (!post.primaryCta?.label || !post.primaryCta?.href) {
      errors.push(`${post.slug}: primaryCta label and href are required`);
    }

    if (!post.secondaryCta?.label || !post.secondaryCta?.href) {
      errors.push(`${post.slug}: secondaryCta label and href are required`);
    }

    const heroImage = typeof post.heroImage === "string" ? post.heroImage : "";

    if (!heroImage || !heroImage.startsWith("/")) {
      errors.push(`${post.slug}: heroImage must be root-relative`);
    }

    if (heroImage) {
      const heroImagePath = path.join(publicDir, heroImage.replace(/^\/+/, ""));
      if (!fs.existsSync(heroImagePath)) {
        errors.push(`${post.slug}: heroImage file does not exist at ${heroImagePath}`);
      }
    }

    if (hasTopLevelHeading(post.markdown)) {
      errors.push(`${post.slug}: body must not include an h1, the template renders it`);
    }

    if (countSectionHeadings(post.markdown) < 3) {
      errors.push(`${post.slug}: body should include at least 3 primary sections`);
    }

    if (post.wordCount < MIN_WORD_COUNT) {
      errors.push(`${post.slug}: word count is ${post.wordCount}, minimum is ${MIN_WORD_COUNT}`);
    }

    if (post.wordCount > MAX_WORD_COUNT) {
      errors.push(
        `${post.slug}: word count is ${post.wordCount}, which is above the allowed maximum of ${MAX_WORD_COUNT}`,
      );
    }

    const maxRepeatedHeadingCount = countRepeatedHeadings(post.markdown);
    if (maxRepeatedHeadingCount > 3) {
      errors.push(
        `${post.slug}: repeated heading pattern detected, one heading appears ${maxRepeatedHeadingCount} times`,
      );
    }

    const maxRepeatedParagraphCount = countRepeatedParagraphs(post.markdown);
    if (maxRepeatedParagraphCount > 2) {
      errors.push(
        `${post.slug}: repeated paragraph pattern detected, one long paragraph appears ${maxRepeatedParagraphCount} times`,
      );
    }

    if (post.description.length < 120 || post.description.length > 170) {
      warnings.push(
        `${post.slug}: meta description length is ${post.description.length}, aim for 120-170 characters`,
      );
    }

    if (post.sources.length === 0) {
      warnings.push(`${post.slug}: no sources listed, AI-search citation potential may be weaker`);
    }

    const staleToneHits = findStaleToneHits(post.markdown);
    if (staleToneHits.length > 0) {
      const summary = staleToneHits
        .map((hit) => `"${hit.sample}" x${hit.count}`)
        .join(", ");
      warnings.push(
        `${post.slug}: stale tone phrases detected, rewrite for a more human voice: ${summary}`,
      );
    }

    if (hasFaqSection(post.markdown)) {
      errors.push(`${post.slug}: body must not include an FAQ or Common Questions section`);
    }

    if (hasEmptyReferencesSection(post.markdown)) {
      errors.push(`${post.slug}: empty Sources or References section detected`);
    }

    const missingBodyImagePaths = findMissingBodyImagePaths(post.markdown);
    if (missingBodyImagePaths.length > 0) {
      errors.push(
        `${post.slug}: body image file does not exist for ${missingBodyImagePaths.join(", ")}`,
      );
    }

    if (/TODO|lorem ipsum/i.test(post.markdown)) {
      errors.push(`${post.slug}: placeholder text detected`);
    }
  }

  const postSlugSet = new Set(posts.map((post) => post.slug));

  for (const post of posts) {
    for (const relatedSlug of post.relatedSlugs) {
      if (!postSlugSet.has(relatedSlug)) {
        errors.push(`${post.slug}: related slug "${relatedSlug}" does not exist`);
      }
    }
  }

  if (warnings.length > 0) {
    console.warn("Blog validation warnings:");
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error("Blog validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Validated ${posts.length} blog posts.`);
}

try {
  validate();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Blog validation failed:");
  console.error(`- ${message}`);
  process.exitCode = 1;
}
