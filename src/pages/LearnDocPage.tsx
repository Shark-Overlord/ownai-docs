import type { ClipboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { ChevronLeft, FileText, List, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ApiError } from '../lib/api';
import { getDoc, listDocBooks, listDocToc, YuqueBook, YuqueDoc, YuqueTocItem } from '../lib/docsApi';

type OutlineItem = {
  id: string;
  title: string;
  level: number;
};

export function LearnDocPage() {
  const { bookSlug = '', docSlug = '' } = useParams();
  const [book, setBook] = useState<YuqueBook | null>(null);
  const [toc, setToc] = useState<YuqueTocItem[]>([]);
  const [doc, setDoc] = useState<YuqueDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDoc() {
      setLoading(true);
      setError('');
      setDoc(null);

      const [books, nextToc] = await Promise.all([
        listDocBooks().catch(() => []),
        listDocToc(bookSlug).catch(() => []),
      ]);
      if (!active) return;
      setBook(books.find((item) => item.slug === bookSlug) || null);
      setToc(nextToc);

      try {
        const nextDoc = await getDoc(bookSlug, docSlug);
        if (!active) return;
        setDoc(nextDoc);
        document.title = `${nextDoc.title} - OwnAI`;
      } catch (err) {
        if (!active) return;
        if (err instanceof ApiError && err.code === 40100) {
          setError('这篇教程需要登录后查看');
        } else if (err instanceof ApiError && err.code === 40101) {
          setError('当前账号没有查看这篇教程的权限');
        } else {
          setError('教程暂时不可用');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDoc();

    return () => {
      active = false;
    };
  }, [bookSlug, docSlug]);

  const preparedContent = useMemo(() => prepareYuqueHtml(doc?.bodyHtml || ''), [doc?.bodyHtml]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root || preparedContent.outline.length === 0) {
      setActiveHeadingId('');
      return;
    }

    const headings = Array.from(root.querySelectorAll<HTMLElement>('h1[id], h2[id], h3[id], h4[id]'));
    if (headings.length === 0) return;

    setActiveHeadingId(headings[0].id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target instanceof HTMLElement) setActiveHeadingId(visible.target.id);
      },
      { rootMargin: '-120px 0px -68% 0px', threshold: [0, 1] },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [preparedContent.html, preparedContent.outline.length]);

  function jumpToHeading(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleArticleCopy(event: ClipboardEvent<HTMLElement>) {
    const selection = window.getSelection();
    const selectedNode = selection?.anchorNode;
    const selectedElement = selectedNode instanceof Element ? selectedNode : selectedNode?.parentElement;
    if (selectedElement?.closest('pre, code, .code-block-extension')) return;
    event.preventDefault();
  }

  const currentIndex = toc.findIndex((item) => item.slug === docSlug);
  const prevDoc = currentIndex > 0 ? toc[currentIndex - 1] : null;
  const nextDoc = currentIndex >= 0 && currentIndex < toc.length - 1 ? toc[currentIndex + 1] : null;

  return (
    <main className="learn-doc-shell min-h-[calc(100vh-64px)] bg-white" onCopy={handleArticleCopy}>
      <WatermarkPattern />
      <div className="sticky top-[64px] z-10 hidden h-14 items-center justify-between border-b border-[#e8edf5] bg-white/95 px-5 backdrop-blur max-[920px]:flex">
        <button
          className="inline-flex h-9 items-center gap-2 rounded-full border border-[#dbe3ef] bg-white px-3 text-sm font-bold text-[#334155]"
          type="button"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={16} />
          目录
        </button>
        <span className="min-w-0 truncate text-sm font-bold text-[#111827]">{doc?.title || book?.name || '教程'}</span>
      </div>

      {sidebarOpen ? (
        <button
          className="fixed inset-0 z-30 hidden bg-slate-950/35 max-[920px]:block"
          type="button"
          aria-label="关闭目录"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div
        className={[
          'learn-doc-layout grid grid-cols-[360px_minmax(0,1fr)_270px] max-[1280px]:grid-cols-[340px_minmax(0,1fr)] max-[920px]:block',
          sidebarCollapsed ? 'learn-doc-layout--collapsed' : '',
        ].join(' ')}
      >
        <aside
          className={[
            'learn-doc-sidebar sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto border-r border-[#eef1f5] bg-white px-3 py-5',
            'max-[920px]:fixed max-[920px]:left-0 max-[920px]:top-0 max-[920px]:z-40 max-[920px]:h-screen max-[920px]:w-[82vw] max-[920px]:max-w-[340px] max-[920px]:shadow-2xl max-[920px]:transition-transform',
            sidebarOpen ? 'max-[920px]:translate-x-0' : 'max-[920px]:-translate-x-full',
          ].join(' ')}
        >
          <button
            className="learn-doc-sidebar-collapse max-[920px]:hidden"
            type="button"
            title={sidebarCollapsed ? '展开' : '收起'}
            aria-label={sidebarCollapsed ? '展开左侧目录' : '收起左侧目录'}
            onClick={() => setSidebarCollapsed((value) => !value)}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
          <div className="learn-doc-sidebar-inner">
          <div className="mb-6 flex items-start justify-between gap-4">
            <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#64748b] no-underline hover:text-[#1677ff]" to="/learn">
              <ChevronLeft size={16} />
              教程中心
            </Link>
            <button
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#64748b] max-[920px]:inline-flex"
              type="button"
              aria-label="关闭目录"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <nav className="mt-6" aria-label="教程目录">
            <div className="learn-doc-sidebar-title">
              <List size={16} />
              <span>目录</span>
            </div>
            <div className="space-y-1">
              {toc.map((item) => {
                const isActive = item.slug === docSlug;
                return (
                  <Link
                    className={[
                      'group flex min-h-10 items-center gap-2 rounded-xl py-2 pr-3 text-sm leading-snug no-underline transition',
                      isActive
                        ? 'bg-[#eff0f0] font-extrabold text-[#202124]'
                        : 'text-[#475569] hover:bg-[#f5f5f5] hover:text-[#202124]',
                    ].join(' ')}
                    key={item.id}
                    style={{ paddingLeft: `${12 + Math.min(Math.max(item.depth - 1, 0), 5) * 14}px` }}
                    title={item.title}
                    to={`/learn/${bookSlug}/${item.slug}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FileText size={15} className="shrink-0 opacity-70" />
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
          </div>
        </aside>

        <section className="learn-doc-main min-w-0 px-10 py-12 max-[920px]:px-5 max-[920px]:py-8">
          <div className="mx-auto max-w-[820px]">
            {loading ? <p className="mt-8 text-[#64748b]">加载中...</p> : null}
            {error ? (
              <div className="mt-8 rounded-3xl border border-red-100 bg-white px-7 py-6 shadow-sm">
                <p className="m-0 text-red-600">{error}</p>
                {error.includes('登录') ? (
                  <Link
                    className="mt-5 inline-flex rounded-full bg-[#1677ff] px-4 py-2 text-sm font-bold text-white no-underline"
                    to={`/login?redirect=${encodeURIComponent(`/learn/${bookSlug}/${docSlug}`)}`}
                  >
                    去登录
                  </Link>
                ) : null}
              </div>
            ) : null}

            {doc ? (
              <article className="learn-reader-article">
                <div className="mb-10">
                  <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#64748b] no-underline hover:text-[#1677ff]" to={`/learn/${bookSlug}`}>
                    <ChevronLeft size={16} />
                    返回目录
                  </Link>
                  <h1 className="m-0 mt-8 text-[42px] font-black leading-[1.22] tracking-normal text-[#202124] max-[760px]:text-[34px]">
                    {doc.title}
                  </h1>
                  {doc.description ? (
                    <p className="mt-5 text-lg leading-[1.85] text-[#50617a]">{doc.description}</p>
                  ) : null}
                  {doc.coverUrl ? (
                    <img className="mt-8 w-full rounded-2xl border border-[#e5e7eb]" src={doc.coverUrl} alt="" />
                  ) : null}
                </div>

                {preparedContent.html ? (
                  <div
                    ref={contentRef}
                    className="ownai-yuque-content learn-reader-content"
                    dangerouslySetInnerHTML={{ __html: preparedContent.html }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap break-words rounded-2xl border border-[#e8edf5] bg-white p-6 font-sans text-[17px] leading-[1.9] text-[#111827]">
                    {doc.bodyMarkdown || '暂无正文'}
                  </pre>
                )}

                <div className="mt-14 border-t border-[#e8edf5] pt-6">
                  {doc.lastSyncAt ? <p className="mb-5 text-sm text-[#94a3b8]">最近同步：{doc.lastSyncAt}</p> : null}
                  <div className="grid grid-cols-2 gap-4 max-[680px]:grid-cols-1">
                    {prevDoc ? (
                      <Link className="rounded-2xl border border-[#e5e7eb] bg-white p-5 text-inherit no-underline transition hover:border-[#1677ff]" to={`/learn/${bookSlug}/${prevDoc.slug}`}>
                        <span className="text-xs font-bold text-[#94a3b8]">上一篇</span>
                        <p className="m-0 mt-2 font-extrabold text-[#111827]">{prevDoc.title}</p>
                      </Link>
                    ) : <span />}
                    {nextDoc ? (
                      <Link className="rounded-2xl border border-[#e5e7eb] bg-white p-5 text-right text-inherit no-underline transition hover:border-[#1677ff] max-[680px]:text-left" to={`/learn/${bookSlug}/${nextDoc.slug}`}>
                        <span className="text-xs font-bold text-[#94a3b8]">下一篇</span>
                        <p className="m-0 mt-2 font-extrabold text-[#111827]">{nextDoc.title}</p>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ) : null}
          </div>
        </section>

        <aside className="learn-doc-outline sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto border-l border-[#eef1f5] bg-white px-6 py-10 max-[1280px]:hidden">
          <p className="mb-4 text-sm font-extrabold text-[#111827]">大纲</p>
          {preparedContent.outline.length > 0 ? (
            <nav className="space-y-1" aria-label="文章大纲">
              {preparedContent.outline.map((item) => (
                <button
                  className={[
                    'block w-full rounded-lg py-2 pr-2 text-left text-sm leading-snug transition',
                    activeHeadingId === item.id ? 'font-extrabold text-[#00b96b]' : 'text-[#64748b] hover:bg-white hover:text-[#202124]',
                  ].join(' ')}
                  key={item.id}
                  style={{ paddingLeft: `${Math.max(item.level - 2, 0) * 14 + 8}px` }}
                  type="button"
                  onClick={() => jumpToHeading(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          ) : (
            <p className="text-sm leading-6 text-[#94a3b8]">当前文章没有可生成大纲的标题。</p>
          )}
        </aside>
      </div>
    </main>
  );
}

function prepareYuqueHtml(rawHtml: string): { html: string; outline: OutlineItem[] } {
  if (!rawHtml || typeof window === 'undefined') return { html: rawHtml, outline: [] };

  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ['iframe', 'video', 'audio', 'source', 'details', 'summary'],
    ADD_ATTR: [
      'allow',
      'allowfullscreen',
      'class',
      'controls',
      'data-card-type',
      'data-lake-card',
      'frameborder',
      'loading',
      'style',
      'target',
    ],
  });
  const parser = new DOMParser();
  const parsed = parser.parseFromString(cleanHtml, 'text/html');
  const outline: OutlineItem[] = [];
  const usedIds = new Set<string>();

  parsed.body.querySelectorAll('h1, h2, h3, h4').forEach((heading, index) => {
    const title = normalizeText(heading.textContent || '');
    if (!title) return;

    const level = Number(heading.tagName.slice(1));
    const originalId = heading.getAttribute('id')?.trim();
    const nextId = uniqueHeadingId(originalId || `heading-${index + 1}-${hashText(title)}`, usedIds);
    heading.setAttribute('id', nextId);
    heading.classList.add('ownai-heading-anchor');
    outline.push({ id: nextId, title, level });
  });

  return { html: parsed.body.innerHTML, outline };
}

function WatermarkPattern() {
  return (
    <div className="learn-reader-watermark" aria-hidden="true">
      {Array.from({ length: 30 }).map((_, index) => (
        <span key={index}>wonai</span>
      ))}
    </div>
  );
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function uniqueHeadingId(base: string, usedIds: Set<string>) {
  let nextId = base.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!nextId) nextId = 'heading';
  let finalId = nextId;
  let count = 2;
  while (usedIds.has(finalId)) {
    finalId = `${nextId}-${count}`;
    count += 1;
  }
  usedIds.add(finalId);
  return finalId;
}

function hashText(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash.toString(36);
}
