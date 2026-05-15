import { ArticleCard } from '../components/ArticleCard';
import { SectionLayout, sectionCopy } from '../components/SectionLayout';
import { ArticleSection, getArticlesBySection } from '../lib/articles';

export function SectionPage({ section }: { section: ArticleSection }) {
  const list = getArticlesBySection(section);
  const copy = sectionCopy[section];

  return (
    <SectionLayout section={section}>
      <div className="mb-8">
        <p className="mb-6 text-sm font-bold text-[#1677ff]">{copy.title}</p>
        <h1 className="m-0 text-[44px] font-extrabold leading-tight tracking-normal text-[#050816] max-[760px]:text-[34px]">
          {copy.title}
          {'\u603b\u89c8'}
        </h1>
        <p className="mt-5 max-w-[780px] text-lg leading-[1.8] text-[#111827]">
          {copy.description}
        </p>
      </div>
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
    </SectionLayout>
  );
}
