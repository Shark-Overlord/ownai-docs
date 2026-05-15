import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { ArticleSection, getArticlesBySection } from '../lib/articles';

export const sectionCopy: Record<ArticleSection, { title: string; description: string }> = {
  components: {
    title: '组件',
    description: '学习如何收集、改造、组合和复用自己的前端组件资产。',
  },
  design: {
    title: '设计',
    description: '沉淀界面、布局、视觉风格、页面模板和设计提示词。',
  },
  resources: {
    title: '资源',
    description: '整理 OwnAI 其他产品、工具、模板和外部资料。',
  },
};

interface SectionLayoutProps {
  section: ArticleSection;
  children: React.ReactNode;
}

interface LearningGroup {
  title: string;
  items: Array<{
    title: string;
    slug: string;
  }>;
}

const componentLearningGroups: LearningGroup[] = [
  {
    title: '01 组件资产入门',
    items: [
      { title: '什么是组件资产', slug: '01-component-assets/what-is-component-asset' },
      { title: '组件资产和 UI 框架的区别', slug: '01-component-assets/component-asset-vs-ui-framework' },
      { title: '什么组件值得收藏', slug: '01-component-assets/what-to-collect' },
      { title: '如何判断组件是否可复用', slug: '01-component-assets/reusability-check' },
      { title: '如何给组件命名', slug: '01-component-assets/component-naming' },
      { title: '如何给组件写说明文档', slug: '01-component-assets/component-documentation' },
    ],
  },
  {
    title: '02 组件使用基础',
    items: [
      { title: '组件是什么', slug: '02-usage-basic/component-intro' },
      { title: 'Props / Attributes 与配置', slug: '02-usage-basic/props-attributes-config' },
      { title: 'children / slots 与内容插槽', slug: '02-usage-basic/children-slots' },
      { title: '样式与状态', slug: '02-usage-basic/style-state' },
      { title: '事件与交互', slug: '02-usage-basic/event-interaction' },
      { title: '组件组合', slug: '02-usage-basic/component-composition' },
    ],
  },
  {
    title: '03 收集组件资产',
    items: [
      { title: '从 React 生态中收集组件', slug: '03-collect-assets/collect-from-react-ecosystem' },
      { title: '从 Vue 生态中收集组件', slug: '03-collect-assets/collect-from-vue-ecosystem' },
      { title: '从 UI 框架中收集组件', slug: '03-collect-assets/collect-from-ui-frameworks' },
      { title: '从开源项目中收集组件', slug: '03-collect-assets/collect-from-open-source' },
      { title: '从自己的项目中收集组件', slug: '03-collect-assets/collect-from-own-projects' },
      { title: '从 AI 生成结果中收集组件', slug: '03-collect-assets/collect-from-ai-output' },
      { title: '如何记录组件来源', slug: '03-collect-assets/record-component-source' },
      { title: '如何保存组件截图', slug: '03-collect-assets/save-component-screenshot' },
      { title: '如何保存组件使用场景', slug: '03-collect-assets/save-component-use-case' },
      { title: 'Skill：自动收集组件资产', slug: '03-collect-assets/skill-auto-collect-component-assets' },
    ],
  },
  {
    title: '04 基础组件资产',
    items: [
      { title: 'Button 按钮', slug: '04-basic-assets/button-showcase' },
      { title: 'Icon 图标', slug: '04-basic-assets/icon' },
      { title: 'Typography 文本', slug: '04-basic-assets/typography' },
      { title: 'Card 卡片', slug: '04-basic-assets/card' },
      { title: 'Tag 标签', slug: '04-basic-assets/tag' },
      { title: 'Divider 分割线', slug: '04-basic-assets/divider' },
      { title: 'Skill：生成基础组件资产', slug: '04-basic-assets/skill-generate-basic-components' },
    ],
  },
  {
    title: '05 表单组件资产',
    items: [
      { title: 'Input 输入框', slug: '05-form-assets/input' },
      { title: 'Textarea 多行输入', slug: '05-form-assets/textarea' },
      { title: 'Select 下拉选择', slug: '05-form-assets/select' },
      { title: 'Checkbox 多选', slug: '05-form-assets/checkbox' },
      { title: 'Radio 单选', slug: '05-form-assets/radio' },
      { title: 'Switch 开关', slug: '05-form-assets/switch' },
      { title: 'Form 表单组合', slug: '05-form-assets/form' },
      { title: 'Skill：生成表单组件资产', slug: '05-form-assets/skill-generate-form-components' },
    ],
  },
  {
    title: '06 内容展示组件',
    items: [
      { title: 'List 列表', slug: '06-display-assets/list' },
      { title: 'Table 表格', slug: '06-display-assets/table' },
      { title: 'Image 图片', slug: '06-display-assets/image' },
      { title: 'Avatar 头像', slug: '06-display-assets/avatar' },
      { title: 'Statistic 统计', slug: '06-display-assets/statistic' },
      { title: 'Empty 空状态', slug: '06-display-assets/empty' },
      { title: 'Skeleton 骨架屏', slug: '06-display-assets/skeleton' },
      { title: 'Skill：生成展示组件资产', slug: '06-display-assets/skill-generate-display-components' },
    ],
  },
  {
    title: '07 操作反馈组件',
    items: [
      { title: 'Alert 提示', slug: '07-feedback-assets/alert' },
      { title: 'Message 消息', slug: '07-feedback-assets/message' },
      { title: 'Modal 弹窗', slug: '07-feedback-assets/modal' },
      { title: 'Drawer 抽屉', slug: '07-feedback-assets/drawer' },
      { title: 'Loading 加载', slug: '07-feedback-assets/loading' },
      { title: 'Progress 进度条', slug: '07-feedback-assets/progress' },
      { title: 'Skill：生成反馈组件资产', slug: '07-feedback-assets/skill-generate-feedback-components' },
    ],
  },
  {
    title: '08 页面导航组件',
    items: [
      { title: 'Menu 菜单', slug: '08-navigation-assets/menu' },
      { title: 'Tabs 标签页', slug: '08-navigation-assets/tabs' },
      { title: 'Breadcrumb 面包屑', slug: '08-navigation-assets/breadcrumb' },
      { title: 'Pagination 分页', slug: '08-navigation-assets/pagination' },
      { title: 'Steps 步骤条', slug: '08-navigation-assets/steps' },
      { title: 'Skill：生成导航组件资产', slug: '08-navigation-assets/skill-generate-navigation-components' },
    ],
  },
  {
    title: '09 业务组件资产',
    items: [
      { title: 'SearchBar 搜索栏', slug: '09-business-assets/search-bar' },
      { title: 'FilterPanel 筛选区', slug: '09-business-assets/filter-panel' },
      { title: 'DataToolbar 表格工具栏', slug: '09-business-assets/data-toolbar' },
      { title: 'UserCard 用户卡片', slug: '09-business-assets/user-card' },
      { title: 'LoginForm 登录表单', slug: '09-business-assets/login-form' },
      { title: 'DashboardCard 数据卡片', slug: '09-business-assets/dashboard-card' },
      { title: 'PermissionGate 权限组件', slug: '09-business-assets/permission-gate' },
      { title: 'MarkdownRenderer 内容渲染器', slug: '09-business-assets/markdown-renderer' },
      { title: 'Skill：生成业务组件资产', slug: '09-business-assets/skill-generate-business-components' },
    ],
  },
  {
    title: '10 组件组合模板',
    items: [
      { title: '搜索加列表', slug: '10-composition-templates/search-list' },
      { title: '筛选加表格', slug: '10-composition-templates/filter-table' },
      { title: '表单加提交', slug: '10-composition-templates/form-submit' },
      { title: '卡片数据看板', slug: '10-composition-templates/card-dashboard' },
      { title: '登录注册组合', slug: '10-composition-templates/login-register' },
      { title: '详情页信息区', slug: '10-composition-templates/detail-info-section' },
      { title: '空状态操作区', slug: '10-composition-templates/empty-action-section' },
      { title: '权限控制区域', slug: '10-composition-templates/permission-control-section' },
      { title: 'Skill：生成组件组合模板', slug: '10-composition-templates/skill-generate-composition-templates' },
    ],
  },
  {
    title: '11 组件改造方法',
    items: [
      { title: '如何修改组件样式', slug: '11-transform-methods/edit-component-style' },
      { title: '如何替换业务文案', slug: '11-transform-methods/replace-business-copy' },
      { title: '如何抽离组件 Props', slug: '11-transform-methods/extract-component-props' },
      { title: '如何适配不同 UI 框架', slug: '11-transform-methods/adapt-ui-frameworks' },
      { title: '如何适配 TailwindCSS', slug: '11-transform-methods/adapt-tailwindcss' },
      { title: '如何适配后端接口数据', slug: '11-transform-methods/adapt-backend-data' },
      { title: '如何处理组件状态', slug: '11-transform-methods/handle-component-state' },
      { title: 'Skill：改造组件为业务资产', slug: '11-transform-methods/skill-transform-component-to-business-asset' },
    ],
  },
  {
    title: '12 个人组件库维护',
    items: [
      { title: '如何分类组件', slug: '12-personal-library/classify-components' },
      { title: '如何命名组件', slug: '12-personal-library/name-components' },
      { title: '如何写组件说明', slug: '12-personal-library/write-component-docs' },
      { title: '如何记录使用场景', slug: '12-personal-library/record-use-cases' },
      { title: '如何管理版本变化', slug: '12-personal-library/manage-version-changes' },
      { title: '如何定期清理组件', slug: '12-personal-library/cleanup-components' },
      { title: '如何在新项目中复用', slug: '12-personal-library/reuse-in-new-projects' },
      { title: 'Skill：维护个人组件库', slug: '12-personal-library/skill-maintain-personal-component-library' },
    ],
  },
];

const designLearningGroups: LearningGroup[] = [
  {
    title: '01 界面入门',
    items: [
      { title: '界面由什么组成', slug: '01-interface-intro/interface-parts' },
      { title: '常见页面结构', slug: '01-interface-intro/common-page-structure' },
      { title: '信息层级', slug: '01-interface-intro/information-hierarchy' },
      { title: '视觉重心', slug: '01-interface-intro/visual-focus' },
      { title: '留白与对齐', slug: '01-interface-intro/spacing-alignment' },
      { title: '设计稿怎么看', slug: '01-interface-intro/read-design-file' },
    ],
  },
  {
    title: '02 布局基础',
    items: [
      { title: '页面宽度', slug: '02-layout-basic/page-width' },
      { title: '栅格布局', slug: '02-layout-basic/grid-layout' },
      { title: '上中下布局', slug: '02-layout-basic/header-main-footer' },
      { title: '左右布局', slug: '02-layout-basic/sidebar-layout' },
      { title: '卡片布局', slug: '02-layout-basic/card-layout' },
      { title: '响应式布局', slug: '02-layout-basic/responsive-layout' },
    ],
  },
  {
    title: '03 视觉风格',
    items: [
      { title: '色彩系统', slug: '03-visual-style/color-system' },
      { title: '字体系统', slug: '03-visual-style/typography-system' },
      { title: '圆角系统', slug: '03-visual-style/radius-system' },
      { title: '阴影系统', slug: '03-visual-style/shadow-system' },
      { title: '边框与分割线', slug: '03-visual-style/border-divider' },
      { title: '背景与纹理', slug: '03-visual-style/background-texture' },
    ],
  },
  {
    title: '04 页面类型',
    items: [
      { title: '首页', slug: '04-page-types/home-page' },
      { title: '登录页', slug: '04-page-types/login-page' },
      { title: '列表页', slug: '04-page-types/list-page' },
      { title: '详情页', slug: '04-page-types/detail-page' },
      { title: '表单页', slug: '04-page-types/form-page' },
      { title: '设置页', slug: '04-page-types/settings-page' },
      { title: '数据看板', slug: '04-page-types/dashboard-page' },
      { title: '文章页', slug: '04-page-types/article-page' },
    ],
  },
  {
    title: '05 修改界面',
    items: [
      { title: '修改标题和文案', slug: '05-edit-interface/edit-title-copy' },
      { title: '修改颜色', slug: '05-edit-interface/edit-color' },
      { title: '修改间距', slug: '05-edit-interface/edit-spacing' },
      { title: '修改卡片', slug: '05-edit-interface/edit-card' },
      { title: '修改导航', slug: '05-edit-interface/edit-navigation' },
      { title: '修改按钮', slug: '05-edit-interface/edit-button' },
      { title: '修改响应式', slug: '05-edit-interface/edit-responsive' },
      { title: '修改空状态', slug: '05-edit-interface/edit-empty-state' },
    ],
  },
  {
    title: '06 搭建实战',
    items: [
      { title: '搭建一个首页', slug: '06-build-practice/build-home-page' },
      { title: '搭建一个后台布局', slug: '06-build-practice/build-admin-layout' },
      { title: '搭建一个列表管理页', slug: '06-build-practice/build-list-management' },
      { title: '搭建一个详情页', slug: '06-build-practice/build-detail-page' },
      { title: '搭建一个表单提交页', slug: '06-build-practice/build-form-submit' },
      { title: '搭建一个数据看板', slug: '06-build-practice/build-dashboard' },
      { title: '搭建一个知识库页面', slug: '06-build-practice/build-knowledge-base' },
    ],
  },
  {
    title: '07 设计提示词',
    items: [
      { title: '页面设计提示词', slug: '07-design-prompts/page-design-prompt' },
      { title: '风格修改提示词', slug: '07-design-prompts/style-edit-prompt' },
      { title: '布局优化提示词', slug: '07-design-prompts/layout-optimization-prompt' },
      { title: '配色优化提示词', slug: '07-design-prompts/color-optimization-prompt' },
      { title: '组件组合提示词', slug: '07-design-prompts/component-composition-prompt' },
      { title: '界面评审提示词', slug: '07-design-prompts/interface-review-prompt' },
    ],
  },
  {
    title: '08 设计资产沉淀',
    items: [
      { title: '什么值得沉淀', slug: '08-design-assets/what-to-save' },
      { title: '如何整理截图参考', slug: '08-design-assets/screenshot-reference' },
      { title: '如何保存配色方案', slug: '08-design-assets/save-color-scheme' },
      { title: '如何保存页面模板', slug: '08-design-assets/save-page-template' },
      { title: '如何保存组件组合', slug: '08-design-assets/save-component-composition' },
      { title: '如何保存 Prompt', slug: '08-design-assets/save-prompt' },
      { title: '如何命名和归档', slug: '08-design-assets/naming-archive' },
    ],
  },
  {
    title: '09 复用与增长',
    items: [
      { title: '如何复用一个页面', slug: '09-reuse-growth/reuse-page' },
      { title: '如何复用一个布局', slug: '09-reuse-growth/reuse-layout' },
      { title: '如何复用一种风格', slug: '09-reuse-growth/reuse-style' },
      { title: '如何从项目中提炼模板', slug: '09-reuse-growth/extract-template' },
      { title: '如何建立个人设计库', slug: '09-reuse-growth/personal-design-library' },
      { title: '如何和组件库配合使用', slug: '09-reuse-growth/work-with-component-library' },
      { title: '如何减少重复设计工作', slug: '09-reuse-growth/reduce-repetitive-design' },
    ],
  },
];

const groupedSections: Partial<Record<ArticleSection, LearningGroup[]>> = {
  components: componentLearningGroups,
  design: designLearningGroups,
};

export function SectionLayout({ section, children }: SectionLayoutProps) {
  const location = useLocation();
  const list = getArticlesBySection(section);
  const copy = sectionCopy[section];
  const groups = groupedSections[section];
  const existingArticleSlugs = new Set(
    list.map((article) => article.slug.replace(`${section}/`, '')),
  );

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const activeGroup = groups?.find((g) =>
      g.items.some((item) => location.pathname.includes(item.slug))
    );
    return new Set(activeGroup ? [activeGroup.title] : groups ? [groups[0].title] : []);
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'relative block rounded-lg px-4 py-2.5 text-[14px] leading-snug no-underline transition-all duration-200',
      isActive
        ? 'bg-blue-50/60 text-blue-600 font-semibold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-1/2 before:w-[3px] before:rounded-r-full before:bg-blue-600'
        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:translate-x-1',
    ].join(' ');

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white lg:pl-[320px]">
      <aside className="border-[#e5e7eb] bg-white lg:fixed lg:left-0 lg:top-[64px] lg:h-[calc(100vh-64px)] lg:w-[320px] lg:overflow-auto lg:border-r">
        <nav className="grid gap-2 px-5 py-10" aria-label={`${copy.title}导航`}>
          <NavLink className={linkClass} to={`/${section}`} end>
            {copy.title} 总览
          </NavLink>
          {groups ? (
            <div className="mt-6 grid gap-2">
              {groups.map((group) => {
                const isExpanded = expandedGroups.has(group.title);
                return (
                  <div className="grid gap-1" key={group.title}>
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className="flex w-full items-center justify-between px-4 pb-2 pt-4 text-left text-[13px] font-extrabold tracking-wider text-slate-400 uppercase transition-colors hover:text-slate-600"
                    >
                      <span>{group.title}</span>
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="grid gap-1 animate-fade-in-up">
                        {group.items.map((item) => {
                          const isReady = existingArticleSlugs.has(item.slug);

                          if (!isReady) {
                            return (
                              <span
                                className="block rounded-lg px-4 py-2.5 text-[14px] leading-snug text-slate-400"
                                key={item.title}
                              >
                                {item.title}
                              </span>
                            );
                          }

                          return (
                            <NavLink className={linkClass} to={`/${section}/${item.slug}`} key={item.title}>
                              {item.title}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 grid gap-2">
              <span className="px-4 pb-2 pt-4 text-[13px] font-extrabold tracking-wider text-slate-400 uppercase">
                文章
              </span>
              {list.map((article) => (
                <NavLink className={linkClass} to={article.href} key={article.slug}>
                  {article.title}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </aside>
      <section className="flex min-h-[calc(100vh-64px)] min-w-0 flex-col px-8 pt-[72px] max-[760px]:px-4 max-[760px]:pt-10">
        <div className="flex-1">{children}</div>
        <Footer />
      </section>
    </main>
  );
}
