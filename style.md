# OwnAI 文档站风格与交互设计规范 (UI/UX Prompt)

此文档总结了当前 OwnAI 文档站的整体布局、色彩系统、动效交互以及核心组件的实现逻辑。可作为系统提示词（System Prompt）交给其他 AI，以完全复刻当前网站的设计风格。

---

## 1. 核心设计原则 (Design Principles)
- **极简与呼吸感**：大量使用白色 (`bg-white`) 和极浅灰色背景 (`bg-[#f7f8fa]`, `bg-[#f8fafc]`)，利用大留白而非线框进行区块划分。
- **现代化科技感**：利用蓝紫渐变 (`bg-gradient-to-r from-blue-600 to-purple-600`)、背景模糊 (`backdrop-blur-xl`) 和细腻的悬浮投影。
- **高级互动反馈**：所有的可交互元素（链接、卡片、按钮）均必须带有平滑的过度动效 (`transition-all duration-300`)，强调“物理反馈感”。

## 2. 全局样式与动效 (Global Styles & Animations)
- **滚动体验**：开启全局平滑滚动 (`html { scroll-behavior: smooth; }`)。
- **自定动画 (Keyframes)**：
  1. `fade-in-up`：元素在 `0.8s` 内由下至上滑入并淡出（配合 `cubic-bezier(0.16, 1, 0.3, 1)`），用于页面核心内容和卡片列表的 **时序错开（Staggered）** 入场。
  2. `breath`：无发光边缘的纯透明度呼吸效果（`opacity` 在 `0.7` 至 `1` 之间循环，持续 `3s ease-in-out infinite`），专用于 Logo 品牌文字。

## 3. 布局与核心组件实现逻辑 (Components)

### 3.1 顶部导航栏 (Header)
- **布局**：粘性定位 (`sticky top-0 z-20`)，高度 `64px`，左右 `px-12`。
- **滚动变色交互**：
  - **未滚动（位于顶部）**时：背景半透明 (`bg-white/80`)，底部带有浅灰长驻细线 (`border-[#eef1f5]`) 以区分内容区。
  - **向下滚动**后：背景变不透明且带毛玻璃 (`bg-white/95 backdrop-blur-xl`)，底部不仅有线，还增加浅阴影 (`shadow-sm`)。
- **导航项下划线展开效果**：Hover 时，导航项文字变蓝，同时其底部出现一条蓝色下划线（`h-[2px] bg-[#1677ff]`），该线条利用 `scale-x-0 group-hover:scale-x-100 origin-left` 实现**从左向右平滑伸展**的动效。
- **Logo 文本**：采用蓝紫渐变色，裁剪文字背景 (`bg-clip-text text-transparent`)，并施加自定义的 `animate-breath` 呼吸动效。

### 3.2 侧边栏导航 (Sidebar - Ant Design Style)
- **布局**：左侧固定 (`fixed left-0`)，宽度 `320px`，带右侧浅灰边框 (`border-r`)。
- **分类标题**：采用平铺设计（无折叠）。分类名为灰色小字 (`text-[13px] text-[#8a94a3]`)，其正下方紧贴一条细灰线 (`h-px w-full bg-[#f0f0f0]`) 进行视觉分隔。
- **当前激活项 (Active Item)**：呈现出“浅蓝底色胶囊”的视觉特征 (`bg-[#e8f3ff] text-[#1677ff] font-medium`)，四周带圆角 (`rounded-lg`)。
- **未开发/待办项**：以灰色纯文本展示 (`text-[#a3adb9]`)，无 Hover 效果。

### 3.3 文章卡片 (Article Card)
- **布局**：带边框的白色圆角卡片 (`rounded-xl border-[#e5e7eb] bg-white p-6`)。
- **悬浮动效 (Hover Feedback)**：
  - **微缩放与阴影**：卡片整体上浮 (`hover:-translate-y-1.5`)。
  - **边框与高光**：边框变为浅蓝色 (`hover:border-blue-300`)。
  - **大光晕阴影**：卡片下方投射出面积宽广的淡蓝色阴影 (`hover:shadow-[0_20px_40px_rgba(22,119,255,0.12)]`)。
  - **文字联动**：利用 `group` 属性，鼠标在卡片任意位置悬浮时，卡片标题文字平滑过渡为蓝色 (`group-hover:text-blue-600`)。

### 3.4 页脚 (Footer)
- **聚光灯效果 (Spotlight Effect)**：
  - 利用 Tailwind 的父级 `group` 控制。当鼠标悬停在页脚某一组链接区域时，**所有同组链接的透明度统一降低变暗 (`group-hover:opacity-40`)**。
  - 当鼠标精确悬停在某一个具体链接上时，该链接的透明度恢复至100%并变为蓝色 (`hover:!opacity-100 hover:text-blue-600`)，从而实现视觉聚焦。
- **Logo**：与头部一致，带有蓝紫流光和呼吸动效。

### 3.5 CTA 按钮组 (Hero Section)
- **主按钮（开始阅读）**：蓝色胶囊按钮。Hover 时，自身阴影急剧扩散 (`hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)]`)，且右侧的箭头图标会向右平移一小段距离 (`group-hover:translate-x-1`)。
- **次按钮（了解更多）**：透明背景，Hover 时背景变浅灰，右侧箭头同样带平移引导效。

---

## 4. 给 AI 的开发指令参考 (Instruction for AI)
当你（AI）在基于此风格添加新页面或新组件时，请务必遵守以下准则：
1. **优先使用预设色调**：主要操作色为 `#1677ff`，边框/分割线为 `#e5e7eb` 或 `#f0f0f0`，正文标题为 `#111827`。
2. **所有卡片交互** 必须套用 `group transition-all duration-300 ease-out hover:-translate-y-1.5` 等类名公式。
3. **复杂交互优先 CSS 实现**：如聚光灯效果、下划线伸缩、卡片内元素联动，均要求使用 Tailwind 的 `group` / `peer` 机制纯 CSS 实现，避免通过 JS 监听 `onMouseEnter` 触发重绘。
4. **进场感**：凡是列表展示（如卡片墙），必须利用 `animate-fade-in-up` 配合 `style={{ animationDelay: '...' }}` 渲染错开进入动画。
5. **动态 Title**：新路由页面必须包含 `useEffect(() => { document.title = '... - OwnAI'; }, [])` 逻辑。
