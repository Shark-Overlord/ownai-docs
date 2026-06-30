import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError } from '../lib/api';
import { getDoc, YuqueDoc } from '../lib/docsApi';

export function LearnDocPage() {
  const { bookSlug = '', docSlug = '' } = useParams();
  const [doc, setDoc] = useState<YuqueDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getDoc(bookSlug, docSlug)
      .then((nextDoc) => {
        if (!active) return;
        setDoc(nextDoc);
        document.title = `${nextDoc.title} - OwnAI`;
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError && err.code === 40100) {
          setError('这篇教程需要登录后查看');
        } else if (err instanceof ApiError && err.code === 40101) {
          setError('当前账号没有查看这篇教程的权限');
        } else {
          setError('教程暂时不可用');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [bookSlug, docSlug]);

  return (
    <main className="mx-auto max-w-[1120px] px-12 py-14 max-[760px]:px-5">
      <div className="flex items-center justify-between gap-4">
        <Link className="text-sm font-bold text-[#1677ff] no-underline" to={`/learn/${bookSlug}`}>
          返回目录
        </Link>
        {error.includes('登录') ? (
          <Link
            className="rounded-full bg-[#1677ff] px-4 py-2 text-sm font-bold text-white no-underline"
            to={`/login?redirect=${encodeURIComponent(`/learn/${bookSlug}/${docSlug}`)}`}
          >
            去登录
          </Link>
        ) : null}
      </div>

      {loading ? <p className="mt-8 text-[#64748b]">加载中...</p> : null}
      {error ? <p className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-red-600">{error}</p> : null}
      {doc ? (
        <article className="mt-8 min-w-0 rounded-[28px] border border-[#e8edf5] bg-white px-10 py-10 shadow-sm max-[760px]:px-6">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[#1677ff]">OwnAI Learn</p>
          <h1 className="m-0 text-[44px] font-extrabold leading-tight tracking-normal text-[#050816] max-[760px]:text-[34px]">
            {doc.title}
          </h1>
          {doc.description ? (
            <p className="mt-5 max-w-[760px] text-lg leading-[1.85] text-[#50617a]">{doc.description}</p>
          ) : null}
          {doc.coverUrl ? (
            <img className="mt-8 w-full rounded-2xl border border-[#e5e7eb]" src={doc.coverUrl} alt="" />
          ) : null}
          <div className="mt-10 text-[17px] leading-[1.9] text-[#111827]">
            {doc.bodyHtml ? (
              <div
                className="ownai-yuque-content"
                dangerouslySetInnerHTML={{ __html: doc.bodyHtml }}
              />
            ) : (
              <pre className="whitespace-pre-wrap break-words font-sans text-[17px] leading-[1.9]">
                {doc.bodyMarkdown || '暂无正文'}
              </pre>
            )}
          </div>
          {doc.lastSyncAt ? <p className="mt-10 text-sm text-[#94a3b8]">最近同步：{doc.lastSyncAt}</p> : null}
        </article>
      ) : null}
    </main>
  );
}
