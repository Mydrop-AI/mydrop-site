# Blog Post Design Standard

This document defines the default structure and style for all future Mydrop blog posts.

## 1. URL and SEO Rules

- URL format: `/post/{slug}`
- Slug style: lowercase, words separated by hyphens
- Every post must include:
  - unique title
  - unique meta description
  - canonical URL
  - BlogPosting JSON-LD
  - breadcrumb JSON-LD
- Add each new blog URL in `scripts/react-snap.cjs` under `include`.

## 2. Required Content Blocks

Each post should follow this order:

1. Back link to blog index
2. Top image banner with overlay gradient
3. Article title and subtitle
4. Author, publish date, updated date, read time chips
5. Intro section (2 to 4 short paragraphs)
6. Main body sections with clear H2 titles
7. Comparison or framework section when relevant
8. Decision checklist section
9. Closing CTA section with two actions

## 2.1 SEO Heading Hierarchy

- Use exactly one `h1` per post, and it must be the post title.
- Use `h2` for primary sections.
- Use `h3` only as children of an `h2` section.
- Use `h4` only inside an `h3` subsection.
- Do not skip heading levels.
- Keep heading text descriptive, plain-language, and keyword aligned.

## 3. Visual System

- Prose-first layout. The article should read like an article, not a dashboard.
- Avoid card-heavy layouts and avoid boxing every paragraph.
- Use clean spacing and visual rhythm for long-form reading comfort.
- Keep content width around readable article length.
- Use visuals to support sections, not replace text.

## 4. Typography and Readability

- Keep language simple and direct.
- Avoid em dash characters. Use commas or periods instead.
- Prefer short paragraphs and active voice.
- Keep line lengths readable with clear section breaks.
- Use sentence-led copy first. Use lists only when they improve clarity.

## 5. Imagery Rules

- Include one top hero banner image per post.
- Use descriptive alt text for every image.
- Keep logos and supporting visuals inside framed cards.
- Do not stretch logos. Use object-fit contain.

## 6. CTA Pattern

Use two actions in the final block:

- Primary: conversion action, for example register free
- Secondary: trust action, for example contact or strategy call

CTA copy should be short and outcome-driven.

## 7. Data Model for New Posts

Add each post in `src/lib/blogPosts.ts` with:

- slug
- title
- description
- author
- publishedAt and updatedAt in ISO format
- readTime
- heroImage and heroImageAlt
- intro paragraphs
- body arrays for bullets, comparisons, and prompts
- closing copy and CTA link

## 8. Quality Checklist Before Merge

- Route loads on `/post/{slug}`
- Blog index links to the post
- Build passes with no TypeScript errors
- React Snap crawls the new post URL
- No em dash characters in copy
- JSON-LD is present and valid
- Heading hierarchy is valid (`h1` > `h2` > `h3` > `h4`)
- Article reads naturally as long-form prose
