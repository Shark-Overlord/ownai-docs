import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { Footer } from '../components/Footer';
import { searchArticles } from '../lib/articles';

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const results = searchArticles(query);

  useEffect(() => {
    document.title = query ? `搜索: ${query} - OwnAI` : '搜索 - OwnAI';
  }, [query]);

  return (
    <>
      <main className="w-full px-8 py-[72px]">
        <div className="mb-8">
          <p className="mb-6 text-sm font-bold text-[#1677ff]">Search</p>
          <h1 className="m-0 text-[44px] font-extrabold leading-tight tracking-normal text-[#050816] max-[760px]:text-[34px]">
            {'\u641c\u7d22\u7ed3\u679c'}
          </h1>
          <p className="mt-5 max-w-[780px] text-lg leading-[1.8] text-[#111827]">
            {query ? `\u5173\u952e\u8bcd\uff1a${query}` : '\u8bf7\u8f93\u5165\u5173\u952e\u8bcd\u3002'}
          </p>
        </div>
        {results.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
            {results.map((article, i) => (
              <ArticleCard 
                article={article} 
                key={article.slug} 
                className="animate-fade-in-up" 
                style={{ animationDelay: `${i * 50}ms` }} 
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d5dce8] bg-[#f8fafc]">
            <p className="text-lg text-[#8a94a3]">{query ? '没有找到匹配的文章' : '输入关键词开始搜索'}</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
