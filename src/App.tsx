import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { ArticlePage } from './pages/ArticlePage';
import { HomePage } from './pages/HomePage';
import { LearnBookPage } from './pages/LearnBookPage';
import { LearnDocPage } from './pages/LearnDocPage';
import { LearnHomePage } from './pages/LearnHomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SearchPage } from './pages/SearchPage';
import { SectionPage } from './pages/SectionPage';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/learn" element={<LearnHomePage />} />
        <Route path="/learn/:bookSlug" element={<LearnBookPage />} />
        <Route path="/learn/:bookSlug/:docSlug" element={<LearnDocPage />} />
        <Route path="/components" element={<SectionPage section="components" />} />
        <Route path="/components/*" element={<ArticlePage section="components" />} />
        <Route path="/design" element={<SectionPage section="design" />} />
        <Route path="/design/*" element={<ArticlePage section="design" />} />
        <Route path="/resources" element={<SectionPage section="resources" />} />
        <Route path="/resources/*" element={<ArticlePage section="resources" />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}
