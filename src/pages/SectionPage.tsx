import { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { SectionLayout, sectionCopy } from '../components/SectionLayout';
import { ArticleSection, getArticlesBySection } from '../lib/articles';
import { resourceLinks } from '../lib/resourceLinks';

export function SectionPage({ section }: { section: ArticleSection }) {
  const list = getArticlesBySection(section);
  const copy = sectionCopy[section];

  useEffect(() => {
    document.title = `${copy.title} - OwnAI`;
  }, [copy.title]);

  return (
    <SectionLayout section={section}>
      <div className="mb-8">
        <p className="mb-6 text-sm font-bold text-[#1677ff]">{copy.title}</p>
        <h1 className="m-0 text-[44px] font-extrabold leading-tight tracking-normal text-[#050816] max-[760px]:text-[34px]">
          {section === 'resources' ? copy.title : `${copy.title}\u603b\u89c8`}
        </h1>
        <p className="mt-5 max-w-[780px] text-lg leading-[1.8] text-[#111827]">
          {copy.description}
        </p>
      </div>
      {section === 'resources' ? (
        <ResourceLinks />
      ) : (
        <div className="grid grid-cols-3 gap-6 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
          {list.map((article, i) => (
            <ArticleCard
              article={article}
              key={article.slug}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      )}
    </SectionLayout>
  );
}

function ResourceLinks() {
  if (resourceLinks.length === 0) {
    return (
      <div className="max-w-[760px] rounded-xl border border-dashed border-[#d7dee8] bg-[#fbfcff] px-7 py-8">
        <h2 className="m-0 text-[24px] font-bold tracking-normal text-[#111827]">项目链接整理中</h2>
        <p className="mb-0 mt-3 leading-[1.8] text-[#50617a]">
          这里将放置 OwnAI 自有产品和项目入口。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
      {resourceLinks.map((item, i) => {
        const className =
          'group flex min-h-[210px] flex-col justify-between rounded-xl border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_20px_40px_rgba(22,119,255,0.12)] animate-fade-in-up';
        const content = (
          <>
            <div>
              <span className="text-[13px] font-bold text-[#1677ff]">{item.category}</span>
              <h2 className="my-3.5 text-[22px] font-bold tracking-normal text-[#111827] transition-colors group-hover:text-blue-600">
                {item.title}
              </h2>
              <p className="m-0 leading-[1.7] text-[#6b7280]">{item.description}</p>
            </div>
            <span className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f7ff] text-[#1677ff] transition-all duration-300 group-hover:bg-[#1677ff] group-hover:text-white">
              <ArrowUpRight size={18} strokeWidth={2.3} />
            </span>
          </>
        );

        if (item.external) {
          return (
            <a
              className={className}
              href={item.href}
              key={item.title}
              rel="noreferrer"
              style={{ animationDelay: `${i * 50}ms` }}
              target="_blank"
            >
              {content}
            </a>
          );
        }

        return (
          <Link
            className={className}
            key={item.title}
            style={{ animationDelay: `${i * 50}ms` }}
            to={item.href}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}
