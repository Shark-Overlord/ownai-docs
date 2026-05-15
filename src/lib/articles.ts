import type { ComponentType } from 'react';

export type ArticleSection = 'components' | 'design' | 'resources';

export interface ArticleFrontmatter {
  title: string;
  description?: string;
  section: ArticleSection;
  date?: string;
  order?: number;
  tags?: string[];
  private?: boolean;
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
  articleId: string;
  href: string;
  sourcePath: string;
}

interface MdxModule {
  default: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
}

const metaModules = import.meta.glob<Partial<ArticleFrontmatter>>('../content/**/*.mdx', {
  eager: true,
  query: '?meta',
  import: 'default',
});

const mdxModules = import.meta.glob<MdxModule>('../content/**/*.mdx');

function slugFromPath(path: string) {
  return path.replace('../content/', '').replace(/\.mdx$/, '');
}

function hrefFromSlug(slug: string) {
  return `/${slug}`;
}

function isArticleSection(value: unknown): value is ArticleSection {
  return value === 'components' || value === 'design' || value === 'resources';
}

function normalize(path: string, rawFrontmatter: Partial<ArticleFrontmatter>): ArticleMeta {
  const slug = slugFromPath(path);
  const articleId = slug.split('/').pop() || slug;
  const section = isArticleSection(rawFrontmatter.section)
    ? rawFrontmatter.section
    : (slug.split('/')[0] as ArticleSection);

  return {
    title: rawFrontmatter.title || articleId,
    description: rawFrontmatter.description,
    section,
    date: rawFrontmatter.date,
    private: rawFrontmatter.private,
    slug,
    articleId,
    href: hrefFromSlug(slug),
    sourcePath: path,
    tags: rawFrontmatter.tags || [],
    order: rawFrontmatter.order ?? 999,
  };
}

export const articles = Object.entries(metaModules)
  .map(([path, frontmatter]) => normalize(path, frontmatter))
  .sort((a, b) => {
    if (a.section !== b.section) return a.section.localeCompare(b.section);
    if ((a.order ?? 999) !== (b.order ?? 999)) return (a.order ?? 999) - (b.order ?? 999);
    return a.title.localeCompare(b.title);
  });

export function getArticlesBySection(section: ArticleSection) {
  return articles.filter((article) => article.section === section);
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export async function loadArticle(slug: string) {
  const meta = getArticleBySlug(slug);
  if (!meta) return null;

  const loader = mdxModules[meta.sourcePath];
  if (!loader) return null;

  const module = await loader();
  return { meta, Content: module.default };
}

export function searchArticles(query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return [];

  return articles.filter((article) => {
    const haystack = [
      article.title,
      article.description,
      article.section,
      ...(article.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(keyword);
  });
}
