import { Link } from 'react-router-dom';
import type { ArticleMeta } from '../lib/articles';

export function ArticleCard({ article, className, style }: { article: ArticleMeta, className?: string, style?: React.CSSProperties }) {
  return (
    <Link
      className={`group flex min-h-[230px] flex-col justify-between rounded-xl border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_20px_40px_rgba(22,119,255,0.12)] ${className || ''}`}
      to={article.href}
      style={style}
    >
      <div>
        <span className="text-[13px] font-bold text-[#1677ff]">{article.section}</span>
        <h2 className="my-3.5 text-[22px] font-bold tracking-normal text-[#111827] transition-colors group-hover:text-blue-600">
          {article.title}
        </h2>
        {article.description ? (
          <p className="m-0 leading-[1.7] text-[#6b7280]">{article.description}</p>
        ) : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {(article.tags || []).slice(0, 3).map((tag) => (
          <span className="rounded-md bg-[#f7f8fa] px-2 py-1 text-xs text-[#6b7280]" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
