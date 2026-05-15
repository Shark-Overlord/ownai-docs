import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SectionLayout } from '../components/SectionLayout';
import { ArticleMeta, ArticleSection, loadArticle } from '../lib/articles';
import { mdxComponents } from '../mdx-components';

type ArticleState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ready'; meta: ArticleMeta; Content: React.ComponentType<any> };

export function ArticlePage({ section }: { section: ArticleSection }) {
  const params = useParams();
  const articlePath = params['*'] || params.articleId;
  const [state, setState] = useState<ArticleState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    if (!articlePath) {
      setState({ status: 'missing' });
      return () => {
        active = false;
      };
    }

    loadArticle(`${section}/${articlePath}`).then((result) => {
      if (!active) return;
      if (!result) setState({ status: 'missing' });
      else setState({ status: 'ready', ...result });
    });

    return () => {
      active = false;
    };
  }, [articlePath, section]);

  const metaTitle = state.status === 'ready' ? state.meta.title : null;
  useEffect(() => {
    if (metaTitle) {
      document.title = `${metaTitle} - OwnAI`;
    }
  }, [metaTitle]);

  if (state.status === 'loading') {
    return (
      <SectionLayout section={section}>
        <div className="text-[#6b7280]">{'\u52a0\u8f7d\u4e2d...'}</div>
      </SectionLayout>
    );
  }

  if (state.status === 'missing') {
    return (
      <SectionLayout section={section}>
        <h1 className="m-0 text-[34px] font-extrabold text-[#050816]">
          {'\u6ca1\u6709\u627e\u5230\u8fd9\u7bc7\u6587\u7ae0'}
        </h1>
      </SectionLayout>
    );
  }

  const { Content, meta } = state;
  const tags = meta.tags || [];

  return (
    <SectionLayout section={section}>
      <article className="min-w-0 max-w-[960px]">
        <p className="mb-6 text-sm font-bold text-[#1677ff]">{meta.section}</p>
        <h1 className="m-0 text-[44px] font-extrabold leading-tight tracking-normal text-[#050816] max-[760px]:text-[34px]">
          {meta.title}
        </h1>
        {tags.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span className="rounded-md bg-[#f7f8fa] px-2 py-1 text-xs text-[#6b7280]" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {meta.description ? (
          <p className="mt-5 max-w-[780px] text-lg leading-[1.8] text-[#111827]">
            {meta.description}
          </p>
        ) : null}
        <div className="mt-10 text-[17px] leading-[1.9] text-[#111827]">
          <Content components={mdxComponents} />
        </div>
      </article>
    </SectionLayout>
  );
}
