import { apiRequest } from './api';

export type YuqueBook = {
  id: number;
  namespace: string;
  slug: string;
  name: string;
  description?: string;
  visibility: 'public' | 'login' | 'admin';
  status: 'online' | 'offline';
  lastSyncAt?: string;
};

export type YuqueTocItem = {
  id: number;
  docId?: number;
  parentId?: number;
  title: string;
  slug: string;
  depth: number;
  sort: number;
};

export type YuqueDoc = {
  id: number;
  bookId: number;
  slug: string;
  title: string;
  description?: string;
  bodyMarkdown?: string;
  bodyHtml?: string;
  coverUrl?: string;
  visibility: 'public' | 'login' | 'admin';
  status: 'online' | 'offline';
  sourceUpdatedAt?: string;
  lastSyncAt?: string;
};

export function listDocBooks() {
  return apiRequest<YuqueBook[]>('/docs/books');
}

export function listDocToc(bookSlug: string) {
  return apiRequest<YuqueTocItem[]>(`/docs/books/${encodeURIComponent(bookSlug)}/toc`);
}

export function getDoc(bookSlug: string, docSlug: string) {
  return apiRequest<YuqueDoc>(
    `/docs/${encodeURIComponent(bookSlug)}/${encodeURIComponent(docSlug)}`,
  );
}

export function searchDocs(keyword: string) {
  return apiRequest<YuqueDoc[]>(`/docs/search?keyword=${encodeURIComponent(keyword)}`);
}
