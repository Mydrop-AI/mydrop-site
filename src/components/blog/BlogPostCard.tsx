import { Link } from "react-router-dom";
import { CalendarDays, Clock3 } from "lucide-react";
import type { BlogPostSummary } from "@/lib/blog";
import { resolveAssetPath } from "@/lib/paths";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(dateValue: string) {
  return dateFormatter.format(new Date(dateValue));
}

interface BlogPostCardProps {
  post: BlogPostSummary;
  compact?: boolean;
  headingTag?: "h2" | "h3";
}

export default function BlogPostCard({
  post,
  compact = false,
  headingTag = "h2",
}: BlogPostCardProps) {
  const HeadingTag = headingTag;

  return (
    <article className={`blog-card ${compact ? "blog-card--compact" : ""}`} itemScope itemType="https://schema.org/BlogPosting">
      <Link
        to={post.canonicalPath}
        className="blog-card__image-link"
        aria-label={`Read ${post.title}`}
        itemProp="url"
      >
        <img
          src={resolveAssetPath(post.heroImage)}
          alt={post.heroImageAlt || post.title}
          className="blog-card__image"
          loading="lazy"
          width="640"
          height="360"
          itemProp="image"
        />
      </Link>

      <div className="blog-card__body">
        <div className="blog-card__meta-top">
          <span className="blog-card__category">{post.category}</span>
        </div>

        <HeadingTag className="blog-card__title" itemProp="headline">
          <Link to={post.canonicalPath} itemProp="url">
            {post.title}
          </Link>
        </HeadingTag>

        <p className="blog-card__description" itemProp="description">
          {post.description}
        </p>

        <p className="blog-card__meta-row">
          <Link
            to={`/authors/${post.author.slug}`}
            className="blog-card__author"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
          >
            <img
              src={resolveAssetPath(post.author.image)}
              alt=""
              aria-hidden="true"
              className="blog-card__author-image"
              loading="lazy"
              width="29"
              height="29"
            />
            <span itemProp="name">{post.author.name}</span>
          </Link>
          <span className="blog-card__meta-item">
            <CalendarDays className="h-3.5 w-3.5" />
            <time dateTime={post.publishedAt} itemProp="datePublished">
              {formatDate(post.publishedAt)}
            </time>
          </span>
          <span className="blog-card__meta-item">
            <Clock3 className="h-3.5 w-3.5" />
            {post.readTimeLabel}
          </span>
        </p>

        <p className="blog-card__read">
          <Link to={post.canonicalPath} aria-label={`Read ${post.title}`}>
            Read article
          </Link>
        </p>
      </div>
    </article>
  );
}
