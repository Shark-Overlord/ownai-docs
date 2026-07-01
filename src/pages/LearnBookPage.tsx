import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { listDocBooks, listDocToc, YuqueBook, YuqueTocItem } from '../lib/docsApi';

export function LearnBookPage() {
  const { bookSlug = '' } = useParams();
  const [book, setBook] = useState<YuqueBook | null>(null);
  const [toc, setToc] = useState<YuqueTocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    Promise.all([listDocBooks(), listDocToc(bookSlug)])
      .then(([books, nextToc]) => {
        if (!active) return;
        const currentBook = books.find((item) => item.slug === bookSlug) || null;
        setBook(currentBook);
        setToc(nextToc);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [bookSlug]);

  if (!loading && !error && book && toc.length > 0) {
    return <Navigate to={`/learn/${bookSlug}/${toc[0].slug}`} replace />;
  }

  if (!loading && (!book || error || toc.length === 0)) {
    return <Navigate to="/learn" replace />;
  }

  return null;
}
