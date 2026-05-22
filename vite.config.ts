import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';
import remarkFrontmatter from 'remark-frontmatter';
import { readFileSync } from 'node:fs';
import { dirname, isAbsolute, resolve as resolvePath } from 'node:path';
import { parse as parseYaml } from 'yaml';

function mdxFrontmatterMeta(): PluginOption {
  const virtualPrefix = '\0mdx-frontmatter-meta:';

  function resolveMetaFile(id: string, importer?: string) {
    const [file, query = ''] = id.split('?');
    const params = new URLSearchParams(query);
    if (!file.endsWith('.mdx') || !params.has('meta')) return null;

    if (isAbsolute(file)) return file;
    if (importer) return resolvePath(dirname(importer.split('?')[0]), file);
    return resolvePath(file);
  }

  return {
    name: 'mdx-frontmatter-meta',
    enforce: 'pre',
    resolveId(id, importer) {
      const file = resolveMetaFile(id, importer);
      return file ? `${virtualPrefix}${file}` : null;
    },
    load(id) {
      if (!id.startsWith(virtualPrefix)) return null;
      const file = id.slice(virtualPrefix.length);
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
