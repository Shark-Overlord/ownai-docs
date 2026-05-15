# OwnAI React MDX Site

这是一个重新开始后的最小实现：Vite + React + MDX + Tailwind CSS。文章就是 `src/content/**/*.mdx` 下的单文件，构建结果输出到 `dist`，可以直接部署为静态站点。

## 命令

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 目录

```text
src/
  components/
    mdx/                 # 可在 MDX 中全局使用的 React 演示组件
  content/
    components/*.mdx     # 组件文章
    design/*.mdx         # 设计文章
    resources/*.mdx      # 资源文章
  lib/articles.ts        # 自动发现 MDX 与 frontmatter
  mdx-components.tsx     # MDX 全局组件注册
  pages/                 # 首页、列表页、详情页、搜索页
```

## 新增文章

新增一个 `.mdx` 文件即可：

```mdx
---
title: 示例文章
description: 这是一篇组件演示文章
section: components
order: 2
tags:
  - React
---

<DemoFrame title="复杂 props">
  <ButtonShowcase
    labels={['保存', '发布']}
    config={{
      radius: 8,
      primaryColor: '#1677ff',
      states: ['default', 'hover', 'disabled'],
    }}
  />
</DemoFrame>
```

## 未来接 Java 登录

保留静态站点作为公开内容层。需要登录时，新增 `src/lib/auth.ts` 调 Java 后台接口，前端根据登录态过滤 `private: true` 的文章入口；真正敏感内容应由 Java API 返回，不能只靠前端隐藏。
