import { useEffect, useState } from 'react';
import { ArrowRight, LockKeyhole, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { listDocBooks, listDocToc, searchDocs, YuqueBook, YuqueDoc } from '../lib/docsApi';

export function LearnHomePage() {
  const [books, setBooks] = useState<YuqueBook[]>([]);
  const [bookEntryPaths, setBookEntryPaths] = useState<Record<string, string>>({});
  const [results, setResults] = useState<YuqueDoc[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    document.title = '教程 - OwnAI';
    listDocBooks()
      .then(async (nextBooks) => {
        if (!active) return;
        const entries = await Promise.all(
          nextBooks.map(async (book) => {
            const toc = await listDocToc(book.slug).catch(() => []);
            const firstDoc = toc.find((item) => item.slug);
            return [book.slug, firstDoc ? `/learn/${book.slug}/${firstDoc.slug}` : `/learn/${book.slug}`] as const;
          }),
        );
        if (!active) return;
        setBookEntryPaths(Object.fromEntries(entries));
        setBooks(nextBooks);
      })
      .catch(() => {
        if (active) setError('教程目录暂时不可用');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSearch(value: string) {
    setKeyword(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setResults(await searchDocs(value.trim()).catch(() => []));
  }

  return (
    <main className="mx-auto max-w-[1180px] px-12 py-14 max-[760px]:px-5">
      <section className="rounded-[28px] border border-[#e8edf5] bg-[linear-gradient(135deg,#f8fbff,#ffffff)] px-10 py-12 max-[760px]:px-6">
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[#1677ff]">OwnAI Learn</p>
        <h1 className="m-0 text-[52px] font-extrabold leading-tight tracking-normal text-[#050816] max-[760px]:text-[38px]">
          教程中心
        </h1>
        <p className="mt-5 max-w-[760px] text-lg leading-[1.85] text-[#50617a]">
          这里承载从语雀同步到站内的教程内容。之后你只需要在语雀维护原文，网站通过后台同步读取缓存。
        </p>
        <div className="mt-8 flex h-12 max-w-[620px] items-center gap-3 rounded-2xl border border-[#dbe3ef] bg-white px-4 shadow-sm">
          <Search size={18} className="text-[#8b95a3]" />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-base text-[#111827] outline-none placeholder:text-[#94a3b8]"
            placeholder="搜索教程"
            value={keyword}
            onChange={(event) => void handleSearch(event.target.value)}
          />
        </div>
      </section>

      {keyword.trim() ? (
        <section className="mt-10">
          <h2 className="text-[24px] font-extrabold text-[#050816]">搜索结果</h2>
          <div className="mt-5 grid grid-cols-3 gap-5 max-[1000px]:grid-cols-2 max-[700px]:grid-cols-1">
            {results.map((doc) => (
              <button
                className="rounded-2xl border border-[#e5e7eb] bg-white p-6 text-left transition hover:-translate-y-1 hover:border-[#1677ff] hover:shadow-[0_20px_45px_rgba(22,119,255,0.12)]"
                key={doc.id}
                onClick={() => navigate(`/learn/${findBookSlug(books, doc.bookId)}/${doc.slug}`)}
                type="button"
              >
                <h3 className="m-0 text-[20px] font-extrabold text-[#111827]">{doc.title}</h3>
                <p className="mb-0 mt-3 line-clamp-3 text-sm leading-[1.7] text-[#64748b]">
                  {doc.description || doc.bodyMarkdown || '暂无摘要'}
                </p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-bold text-[#1677ff]">知识库</p>
            <h2 className="m-0 text-[30px] font-extrabold text-[#050816]">已上线教程</h2>
          </div>
        </div>
        {loading ? <p className="mt-6 text-[#64748b]">加载中...</p> : null}
        {error ? <p className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-red-600">{error}</p> : null}
        {!loading && !error && books.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-[#dbe3ef] px-6 py-8 text-[#64748b]">
            还没有同步教程。先在后台添加语雀知识库并执行同步。
          </p>
        ) : null}
        <div className="mt-6 grid grid-cols-3 gap-6 max-[1000px]:grid-cols-2 max-[700px]:grid-cols-1">
          {books.map((book) => (
            <Link
              className="group min-h-[220px] rounded-2xl border border-[#e5e7eb] bg-white p-7 text-inherit no-underline transition hover:-translate-y-1.5 hover:border-[#1677ff] hover:shadow-[0_22px_50px_rgba(22,119,255,0.13)]"
              key={book.id}
              to={bookEntryPaths[book.slug] || `/learn/${book.slug}`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-bold text-[#1677ff]">
                  {book.visibility === 'public' ? '公开' : '登录可见'}
                </span>
                {book.visibility !== 'public' ? <LockKeyhole size={18} className="text-[#64748b]" /> : null}
              </div>
              <h3 className="mt-8 text-[24px] font-extrabold text-[#111827] transition group-hover:text-[#1677ff]">
                {book.name}
              </h3>
              <p className="mt-3 line-clamp-3 leading-[1.8] text-[#64748b]">{book.description || book.namespace}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1677ff]">
                进入教程 <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function findBookSlug(books: YuqueBook[], bookId: number) {
  return books.find((book) => book.id === bookId)?.slug || '';
}
