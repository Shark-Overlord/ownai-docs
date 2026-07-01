import type { ClipboardEvent, CSSProperties, ReactNode } from 'react';
import { isValidElement, lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown, { type Components } from 'react-markdown';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Copy, FileText, List, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ApiError } from '../lib/api';
import { getDoc, listDocBooks, listDocToc, YuqueBook, YuqueDoc, YuqueTocItem } from '../lib/docsApi';

const CodeSyntaxHighlighter = lazy(() =>
  import('../components/CodeSyntaxHighlighter').then((module) => ({ default: module.CodeSyntaxHighlighter })),
);

type OutlineItem = {
  id: string;
  title: string;
  level: number;
};

type OutlineTreeItem = OutlineItem & {
  children: OutlineTreeItem[];
};

type PreparedContent = {
  html: string;
  markdown: string;
  outline: OutlineItem[];
  renderKey: string;
  type: 'html' | 'markdown' | 'empty';
};

type MarkdownAstNode = {
  type?: string;
  depth?: number;
  value?: string;
  alt?: string;
  children?: MarkdownAstNode[];
  data?: {
    hProperties?: Record<string, unknown>;
  };
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
  const [expandedOutlineIds, setExpandedOutlineIds] = useState<Set<string>>(new Set());
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

  const preparedContent = useMemo(
    () => prepareYuqueContent(doc?.bodyMarkdown || '', doc?.bodyHtml || ''),
    [doc?.bodyHtml, doc?.bodyMarkdown],
  );
  const markdownComponents = useMemo(() => createMarkdownComponents(), []);
  const outlineTree = useMemo(() => buildOutlineTree(preparedContent.outline), [preparedContent.outline]);
  const activeOutlinePath = useMemo(
    () => findOutlinePath(outlineTree, activeHeadingId),
    [activeHeadingId, outlineTree],
  );

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
  }, [preparedContent.renderKey, preparedContent.outline.length]);

  useEffect(() => {
    setExpandedOutlineIds(new Set());
  }, [preparedContent.renderKey]);

  useEffect(() => {
    if (activeOutlinePath.length <= 1) return;
    setExpandedOutlineIds((previous) => {
      const next = new Set(previous);
      let changed = false;
      activeOutlinePath.slice(0, -1).forEach((id) => {
        if (!next.has(id)) {
          next.add(id);
          changed = true;
        }
      });
      return changed ? next : previous;
    });
  }, [activeOutlinePath]);

  function jumpToHeading(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleOutlineItem(item: OutlineTreeItem) {
    if (item.children.length > 0) {
      setExpandedOutlineIds((previous) => {
        const next = new Set(previous);
        if (next.has(item.id)) {
          next.delete(item.id);
        } else {
          next.add(item.id);
        }
        return next;
      });
    }
    jumpToHeading(item.id);
  }

  function renderOutlineItems(items: OutlineTreeItem[], depth = 0) {
    return items.map((item) => {
      const hasChildren = item.children.length > 0;
      const isExpanded = expandedOutlineIds.has(item.id);
      const isActive = activeHeadingId === item.id;

      return (
        <div className="learn-doc-outline-node" key={item.id}>
          <button
            className={[
              'learn-doc-outline-item',
              `learn-doc-outline-item--level-${Math.min(Math.max(item.level, 1), 4)}`,
              isActive ? 'learn-doc-outline-item--active' : '',
              hasChildren ? 'learn-doc-outline-item--parent' : '',
            ].join(' ')}
            style={{ '--outline-indent': `${depth * 18}px` } as CSSProperties}
            title={item.title}
            type="button"
            onClick={() => toggleOutlineItem(item)}
          >
            <span className="learn-doc-outline-caret" aria-hidden="true">
              {hasChildren ? (isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />) : null}
            </span>
            <span className="min-w-0 flex-1 truncate">{item.title}</span>
          </button>
          {hasChildren && isExpanded ? renderOutlineItems(item.children, depth + 1) : null}
        </div>
      );
    });
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
          'learn-doc-layout grid grid-cols-[360px_minmax(0,1fr)_340px] max-[1360px]:grid-cols-[340px_minmax(0,1fr)] max-[920px]:block',
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
                  <h1 className="m-0 text-[42px] font-black leading-[1.22] tracking-normal text-[#202124] max-[760px]:text-[34px]">
                    {doc.title}
                  </h1>
                  {doc.coverUrl ? (
                    <Zoom zoomMargin={28}>
                      <img
                        className="mx-auto mt-8 block max-w-full rounded-2xl border border-[#e5e7eb]"
                        src={doc.coverUrl}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </Zoom>
                  ) : null}
                </div>

                {preparedContent.type === 'markdown' ? (
                  <div ref={contentRef} className="ownai-yuque-content learn-reader-content">
                    <ReactMarkdown
                      components={markdownComponents}
                      remarkPlugins={[remarkGfm, remarkHeadingAnchors]}
                    >
                      {preparedContent.markdown}
                    </ReactMarkdown>
                  </div>
                ) : preparedContent.type === 'html' ? (
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

        <aside className="learn-doc-outline sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto border-l border-[#eef1f5] bg-white px-6 py-10 max-[1360px]:hidden">
          <p className="mb-4 text-sm font-extrabold text-[#111827]">大纲</p>
          {outlineTree.length > 0 ? (
            <nav className="space-y-1" aria-label="文章大纲">
              {renderOutlineItems(outlineTree)}
            </nav>
          ) : (
            <p className="text-sm leading-6 text-[#94a3b8]">当前文章没有可生成大纲的标题。</p>
          )}
        </aside>
      </div>
    </main>
  );
}

function prepareYuqueContent(rawMarkdown: string, rawHtml: string): PreparedContent {
  if (rawMarkdown.trim()) {
    const markdown = rawMarkdown.trim();
    return {
      html: '',
      markdown,
      outline: extractMarkdownOutline(markdown),
      renderKey: `markdown:${hashText(markdown)}`,
      type: 'markdown',
    };
  }

  if (rawHtml.trim()) {
    const preparedHtml = prepareYuqueHtml(rawHtml);
    return {
      html: preparedHtml.html,
      markdown: '',
      outline: preparedHtml.outline,
      renderKey: `html:${hashText(preparedHtml.html)}`,
      type: 'html',
    };
  }

  return { html: '', markdown: '', outline: [], renderKey: 'empty', type: 'empty' };
}

function prepareYuqueHtml(rawHtml: string): Pick<PreparedContent, 'html' | 'outline'> {
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
      'referrerpolicy',
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

  parsed.body.querySelectorAll('img').forEach((image) => {
    image.setAttribute('loading', 'lazy');
    image.setAttribute('referrerpolicy', 'no-referrer');
  });

  return { html: parsed.body.innerHTML, outline };
}

function extractMarkdownOutline(markdown: string): OutlineItem[] {
  const outline: OutlineItem[] = [];
  const usedIds = new Set<string>();
  let inFence = false;
  let headingIndex = 0;

  markdown.split(/\r?\n/).forEach((line) => {
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    const headingMatch = line.match(/^(#{1,4})\s+(.+?)\s*#*\s*$/);
    if (!headingMatch) return;

    const title = normalizeText(stripMarkdownInline(headingMatch[2]));
    if (!title) return;

    headingIndex += 1;
    const level = headingMatch[1].length;
    const id = uniqueHeadingId(`heading-${headingIndex}-${hashText(title)}`, usedIds);
    outline.push({ id, title, level });
  });

  return outline;
}

function remarkHeadingAnchors() {
  return (tree: MarkdownAstNode) => {
    const usedIds = new Set<string>();
    let headingIndex = 0;

    visit(tree as never, 'heading', (node: MarkdownAstNode) => {
      const level = node.depth || 0;
      if (level < 1 || level > 4) return;

      const title = normalizeText(markdownNodeText(node));
      if (!title) return;

      headingIndex += 1;
      const id = uniqueHeadingId(`heading-${headingIndex}-${hashText(title)}`, usedIds);
      node.data = node.data || {};
      node.data.hProperties = {
        ...(node.data.hProperties || {}),
        id,
        className: 'ownai-heading-anchor',
      };
    });
  };
}

function createMarkdownComponents(): Components {
  return {
    a({ children, href, ...props }) {
      return (
        <a href={href} target={href?.startsWith('#') ? undefined : '_blank'} rel="noreferrer" {...props}>
          {children}
        </a>
      );
    },
    img({ alt, src, ...props }) {
      return (
        <Zoom zoomMargin={28}>
          <img
            {...props}
            alt={alt || ''}
            src={normalizeMarkdownAssetUrl(src)}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="learn-markdown-image"
          />
        </Zoom>
      );
    },
    pre({ children }) {
      const meta = getCodeBlockMeta(children);
      return <MarkdownCodeBlock code={meta.code} language={meta.language} />;
    },
  };
}

function MarkdownCodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const cleanCode = code.replace(/\n$/, '');
  const lineCount = cleanCode.split('\n').length;
  const languageLabel = formatCodeLanguage(language);

  async function copyCode() {
    if (!cleanCode.trim()) return;
    await navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="learn-code-block code-block-extension">
      <div className="learn-code-header">
        <div className="learn-code-window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="learn-code-language">{languageLabel}</span>
        <button className="learn-code-copy" type="button" onClick={copyCode}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? '已复制' : '复制'}</span>
        </button>
      </div>
      <Suspense
        fallback={
          <pre className="learn-code-fallback">
            <code>{cleanCode}</code>
          </pre>
        }
      >
        <CodeSyntaxHighlighter code={cleanCode} language={language} showLineNumbers={lineCount > 6} />
      </Suspense>
    </div>
  );
}

function getCodeBlockMeta(children: ReactNode) {
  const code = extractReactNodeText(children);
  const child = Array.isArray(children) ? children[0] : children;
  if (!isValidElement(child)) {
    return { code, language: undefined };
  }

  const props = child.props as { className?: string };
  const match = /language-([\w-]+)/.exec(props.className || '');
  return { code, language: normalizeCodeLanguage(match?.[1]) };
}

function normalizeCodeLanguage(language?: string) {
  if (!language) return undefined;
  const normalized = language.toLowerCase();
  const aliases: Record<string, string> = {
    bash: 'bash',
    shell: 'bash',
    sh: 'bash',
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    yml: 'yaml',
  };
  return aliases[normalized] || normalized;
}

function formatCodeLanguage(language?: string) {
  if (!language) return 'TEXT';
  const labels: Record<string, string> = {
    bash: 'BASH',
    javascript: 'JS',
    jsx: 'JSX',
    typescript: 'TS',
    tsx: 'TSX',
    json: 'JSON',
    python: 'PYTHON',
    yaml: 'YAML',
  };
  return labels[language] || language.toUpperCase();
}

function buildOutlineTree(items: OutlineItem[]): OutlineTreeItem[] {
  const roots: OutlineTreeItem[] = [];
  const stack: OutlineTreeItem[] = [];

  items.forEach((item) => {
    const node: OutlineTreeItem = { ...item, children: [] };
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  });

  return roots;
}

function findOutlinePath(items: OutlineTreeItem[], targetId: string): string[] {
  if (!targetId) return [];

  for (const item of items) {
    if (item.id === targetId) return [item.id];
    const childPath = findOutlinePath(item.children, targetId);
    if (childPath.length > 0) return [item.id, ...childPath];
  }

  return [];
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

function stripMarkdownInline(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '');
}

function markdownNodeText(node: MarkdownAstNode): string {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (typeof node.alt === 'string') return node.alt;
  return (node.children || []).map(markdownNodeText).join('');
}

function normalizeMarkdownAssetUrl(src: string | undefined) {
  if (!src) return '';
  if (src.startsWith('//')) return `https:${src}`;
  return src;
}

function extractReactNodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractReactNodeText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return extractReactNodeText(node.props.children);
  return '';
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
