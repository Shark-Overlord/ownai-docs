export interface ResourceLink {
  title: string;
  description: string;
  href: string;
  category: string;
  external?: boolean;
}

export const resourceLinks: ResourceLink[] = [
  {
    title: 'Prompt Vault Vision',
    description:
      '本地视觉 Prompt 资产管理器，用于沉淀图像/视频 Prompt、效果图、来源证据、Web UI 仓库和 Skill 仓库。',
    href: '/resources/prompt-vault-vision',
    category: '视觉 Prompt 资产',
  },
  {
    title: 'OwnAI Write Matrix',
    description:
      '小红书图文自动化写作系统，从创作者画像、热点雷达、提示词策略到草稿箱发布，帮助把热点自动转成可发布的小红书图文草稿。',
    href: '/resources/ownai-write-matrix',
    category: '小红书自动写作',
  },
];
