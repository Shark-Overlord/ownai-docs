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
];
