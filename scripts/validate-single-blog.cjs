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

function main() {
  const targetArg = process.argv[2];
  if (!targetArg) {
    console.error("Usage: node scripts/validate-single-blog.cjs <path-to-blog-file>");
    process.exitCode = 1;
    return;
  }

  const targetPath = path.resolve(rootDir, targetArg);
  const posts = readBlogPosts();
  const target = posts.find((post) => path.resolve(post.sourcePath) === targetPath);

  if (!target) {
    console.error(`Target blog file not found in parsed posts: ${targetPath}`);
    process.exitCode = 1;
    return;
  }

  const others = posts.filter((post) => path.resolve(post.sourcePath) !== targetPath);
  const errors = [];
  const warnings = [];

  if (!isoDatePattern.test(target.publishedAt)) {
    errors.push(`${target.slug}: publishedAt must use YYYY-MM-DD`);
  }

  if (!isoDatePattern.test(target.updatedAt)) {
    errors.push(`${target.slug}: updatedAt must use YYYY-MM-DD`);
  }

  if (target.updatedAt < target.publishedAt) {
    errors.push(`${target.slug}: updatedAt cannot be earlier than publishedAt`);
  }

  if (!target.category) {
    errors.push(`${target.slug}: category is required`);
  }

  if (!Array.isArray(target.tags) || target.tags.length < 2) {
    errors.push(`${target.slug}: add at least 2 tags`);
  }

  if (!target.primaryCta?.label || !target.primaryCta?.href) {
    errors.push(`${target.slug}: primaryCta label and href are required`);
  }

  if (!target.secondaryCta?.label || !target.secondaryCta?.href) {
    errors.push(`${target.slug}: secondaryCta label and href are required`);
  }

  if (!target.heroImage || !target.heroImage.startsWith("/")) {
    errors.push(`${target.slug}: heroImage must be root-relative`);
  }

  const heroImagePath = path.join(publicDir, target.heroImage.replace(/^\/+/, ""));
  if (!fs.existsSync(heroImagePath)) {
    errors.push(`${target.slug}: heroImage file does not exist at ${heroImagePath}`);
  }

  if (hasTopLevelHeading(target.markdown)) {
    errors.push(`${target.slug}: body must not include an h1, the template renders it`);
  }

  if (countSectionHeadings(target.markdown) < 3) {
    errors.push(`${target.slug}: body should include at least 3 primary sections`);
  }

  if (target.wordCount < MIN_WORD_COUNT) {
    errors.push(`${target.slug}: word count is ${target.wordCount}, minimum is ${MIN_WORD_COUNT}`);
  }

  if (target.wordCount > MAX_WORD_COUNT) {
    errors.push(`${target.slug}: word count is ${target.wordCount}, which is above the allowed maximum of ${MAX_WORD_COUNT}`);
  }

  const maxRepeatedHeadingCount = countRepeatedHeadings(target.markdown);
  if (maxRepeatedHeadingCount > 3) {
    errors.push(`${target.slug}: repeated heading pattern detected, one heading appears ${maxRepeatedHeadingCount} times`);
  }

  const maxRepeatedParagraphCount = countRepeatedParagraphs(target.markdown);
  if (maxRepeatedParagraphCount > 2) {
    errors.push(`${target.slug}: repeated paragraph pattern detected, one long paragraph appears ${maxRepeatedParagraphCount} times`);
  }

  if (target.description.length < 120 || target.description.length > 170) {
    warnings.push(`${target.slug}: meta description length is ${target.description.length}, aim for 120-170 characters`);
  }

  if (target.sources.length === 0) {
    warnings.push(`${target.slug}: no sources listed, AI-search citation potential may be weaker`);
  }

  const staleToneHits = findStaleToneHits(target.markdown);
  if (staleToneHits.length > 0) {
    const summary = staleToneHits.map((hit) => `"${hit.sample}" x${hit.count}`).join(", ");
    warnings.push(`${target.slug}: stale tone phrases detected, rewrite for a more human voice: ${summary}`);
  }

  if (hasFaqSection(target.markdown)) {
    errors.push(`${target.slug}: body must not include an FAQ or Common Questions section`);
  }

  if (hasEmptyReferencesSection(target.markdown)) {
    errors.push(`${target.slug}: empty Sources or References section detected`);
  }

  const missingBodyImagePaths = findMissingBodyImagePaths(target.markdown);
  if (missingBodyImagePaths.length > 0) {
    errors.push(`${target.slug}: body image file does not exist for ${missingBodyImagePaths.join(", ")}`);
  }

  if (/TODO|lorem ipsum/i.test(target.markdown)) {
    errors.push(`${target.slug}: placeholder text detected`);
  }

  if (others.some((post) => post.slug === target.slug)) {
    errors.push(`Duplicate slug "${target.slug}"`);
  }

  if (others.some((post) => post.title === target.title)) {
    errors.push(`Duplicate title "${target.title}"`);
  }

  const postSlugSet = new Set(posts.map((post) => post.slug));
  for (const relatedSlug of target.relatedSlugs) {
    if (!postSlugSet.has(relatedSlug)) {
      errors.push(`${target.slug}: related slug "${relatedSlug}" does not exist`);
    }
  }

  if (warnings.length > 0) {
    console.warn("Fast blog validation warnings:");
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error("Fast blog validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Validated ${target.slug}.`);
}

main();
