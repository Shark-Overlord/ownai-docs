import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { listDocBooks, listDocToc, YuqueBook, YuqueTocItem } from '../lib/docsApi';

export function LearnBookPage() {
  const { bookSlug = '' } = useParams();
  const [book, setBook] = useState<YuqueBook | null>(null);
  const [toc, setToc] = useState<YuqueTocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([listDocBooks(), listDocToc(bookSlug)])
      .then(([books, nextToc]) => {
        if (!active) return;
        const currentBook = books.find((item) => item.slug === bookSlug) || null;
        setBook(currentBook);
        setToc(nextToc);
        document.title = `${currentBook?.name || '教程'} - OwnAI`;
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
  }, [bookSlug]);

  return (
    <main className="mx-auto max-w-[1180px] px-12 py-14 max-[760px]:px-5">
      <Link className="text-sm font-bold text-[#1677ff] no-underline" to="/learn">
        返回教程中心
      </Link>
      <section className="mt-8 rounded-[28px] border border-[#e8edf5] bg-white px-10 py-10 shadow-sm max-[760px]:px-6">
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[#1677ff]">OwnAI Learn</p>
        <h1 className="m-0 text-[44px] font-extrabold leading-tight tracking-normal text-[#050816] max-[760px]:text-[34px]">
          {book?.name || '教程目录'}
        </h1>
        <p className="mt-5 max-w-[760px] text-lg leading-[1.85] text-[#50617a]">
          {book?.description || '从语雀同步而来的教程目录。'}
        </p>
      </section>

      {loading ? <p className="mt-8 text-[#64748b]">加载中...</p> : null}
      {error ? <p className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-600">{error}</p> : null}
      {!loading && !error && toc.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-[#dbe3ef] px-6 py-8 text-[#64748b]">
          当前知识库还没有同步到教程。
        </p>
      ) : null}
      <div className="mt-8 grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
        {toc.map((item) => (
          <Link
            className="group rounded-2xl border border-[#e5e7eb] bg-white p-6 text-inherit no-underline transition hover:-translate-y-1 hover:border-[#1677ff] hover:shadow-[0_20px_45px_rgba(22,119,255,0.12)]"
            key={item.id}
            style={{ marginLeft: `${Math.max(0, item.depth - 1) * 20}px` }}
            to={`/learn/${bookSlug}/${item.slug}`}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="m-0 text-[21px] font-extrabold text-[#111827] transition group-hover:text-[#1677ff]">
                {item.title}
              </h2>
              <ArrowRight size={18} className="shrink-0 text-[#1677ff]" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
