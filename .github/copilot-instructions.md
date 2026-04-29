# Copilot Instructions

This repository is a Vite/React marketing site for Mydrop.

Mydrop positioning:

- Mydrop is a social media management platform for enterprise brands, large marketing teams, agencies, and multi-brand organizations.
- The buyer is not a solo creator. Write for heads of social, marketing directors, brand teams, agency operations leads, and enterprise content teams managing many channels, brands, regions, approvals, and stakeholders.
- Core pains: fragmented tools, slow approval cycles, inconsistent brand governance, duplicated work across markets, campaign coordination issues, reporting gaps, legal/compliance review, and pressure to publish more without losing control.
- Core outcomes: centralize social operations, protect brand consistency, speed up approvals, coordinate teams, reuse content across channels, improve visibility, reduce operational risk, and scale publishing with confidence.
- SEO goal: capture high-intent searches around social media management, enterprise social media tools, approval workflows, multi-brand publishing, content operations, governance, analytics, collaboration, and Hootsuite-style alternatives.
- Copy should be clear, practical, and executive-readable. Use concrete workflows, decision criteria, examples, checklists, and tradeoffs. Avoid hype, generic AI filler, and advice aimed at tiny freelancers.
- Product mentions should be useful and natural. The article must still help the reader even if every Mydrop mention is removed.

Blog quality bar:

- Write strategic articles people would actually read, not thin SEO outlines.
- Every article needs a clear thesis, a direct answer, original framing, concrete enterprise examples, and practical next steps.
- Prefer connected prose over bullet dumps. Use bullets only when they make a framework easier to scan.
- Good sections should explain the idea, why it matters, what usually goes wrong, and how a serious team should act.
- Optimize for AI/search by making answers quotable and complete, but never sacrifice human readability for extractable snippets.

For automated blog-writing runs:

- Edit only the exact file named in the user prompt.
- Do not inspect the whole repository unless the prompt explicitly asks.
- Do not run `npm`, validation, build, `wc`, grep/search loops, or browser checks during blog-writing tasks.
- Do not edit existing blog posts, React routes, sitemap files, generated files, package files, or scripts.
- Keep blog post frontmatter as JSON between `---` delimiters.
- The outer automation handles author metadata, dates, CTAs, related posts, hero images, section images, validation, sitemap generation, commits, pushes, and Search Console submission.
- Write the requested article directly, then stop.
- In the main blog-writing pass, do not add body images. A separate media pass inserts stock images and may ask you only to improve image alt text and captions.

For normal engineering tasks, follow the local code style and keep edits scoped to the requested change.
