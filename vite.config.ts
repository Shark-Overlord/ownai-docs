import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';
import remarkFrontmatter from 'remark-frontmatter';
import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

function mdxFrontmatterMeta(): PluginOption {
  return {
    name: 'mdx-frontmatter-meta',
    enforce: 'pre',
    load(id) {
      if (!id.endsWith('.mdx?meta')) return null;

      const file = id.slice(0, -'?meta'.length);
      this.addWatchFile(file);

      const raw = readFileSync(file, 'utf8');
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const data = match ? parseYaml(match[1]) : {};

      return `export default ${JSON.stringify(data || {})};`;
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    mdxFrontmatterMeta(),
    mdx({
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [remarkFrontmatter],
    }) as PluginOption,
    react(),
  ],
});
