import {
  LogIn,
  LogOut,
  Search,
  UserCircle,
} from 'lucide-react';
import { FormEvent, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import logo from '../pages/assert/image/logo.png';

const navItems = [
  { to: '/design', label: '\u8bbe\u8ba1' },
  { to: '/components', label: '\u7ec4\u4ef6' },
  { to: '/resources', label: '\u8d44\u6e90' },
  { to: '/learn', label: '\u6559\u7a0b' },
];

export function Header() {
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <header 
      className={`sticky top-0 z-20 flex min-h-[64px] items-center px-12 backdrop-blur-xl transition-all duration-300 border-b max-[1100px]:flex-wrap max-[1100px]:gap-4 max-[1100px]:px-6 max-[1100px]:py-4 ${
        scrolled ? 'bg-white/95 border-[#eef1f5] shadow-sm' : 'bg-white/80 border-[#eef1f5]'
      }`}
    >
      <a className="inline-flex min-w-[190px] items-center gap-2.5 text-[22px] font-bold leading-none text-[#202124] no-underline transition-transform duration-300 hover:-translate-y-[1px]" href="/">
        <img src={logo} alt="" style={{ width: 32, height: 32 }} />
        <span className="animate-breath bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">OwnAI</span>
      </a>

      <form
        className="ml-auto mr-12 flex h-9 w-[300px] items-center gap-2.5 rounded-full bg-[#f7f8fa] px-3.5 text-[#b8c0cc] transition-all duration-300 focus-within:w-[320px] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:shadow-sm max-[1100px]:order-3 max-[1100px]:mx-0 max-[1100px]:w-full focus-within:max-[1100px]:w-full"
        role="search"
        onSubmit={handleSubmit}
      >
        <Search style={{ width: 17, height: 17 }} strokeWidth={2.2} className="transition-colors focus-within:text-blue-500" />
        <input
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#b8c0cc]"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={'\u641c\u7d22\u6587\u6863'}
        />
        <kbd className="rounded-md border border-slate-200 bg-white/80 px-1.5 py-0.5 font-sans text-xs text-[#8b95a3]">
          Ctrl K
        </kbd>
      </form>

      <nav className="flex h-[64px] items-center gap-8 max-[1100px]:order-4 max-[1100px]:h-10 max-[1100px]:w-full max-[1100px]:overflow-x-auto" aria-label="\u4e3b\u5bfc\u822a">
        {navItems.map((item) => (
          <NavLink
            key={`${item.label}-${item.to}`}
            to={item.to}
            end
            className={({ isActive }) =>
              [
                'group relative inline-flex h-[64px] items-center whitespace-nowrap text-base font-medium no-underline max-[1100px]:h-10 transition-colors duration-300 hover:text-blue-600',
                isActive 
                  ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600' 
                  : 'text-[#50617a] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
        {user ? (
          <button
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-[#e5e7eb] bg-white px-4 text-sm font-bold text-[#334155] transition hover:border-[#1677ff] hover:text-[#1677ff]"
            type="button"
            onClick={() => void logout()}
            title="\u9000\u51fa\u767b\u5f55"
          >
            <UserCircle size={17} />
            <span>{user.userName || user.userAccount || 'OwnAI'}</span>
            <LogOut size={16} />
          </button>
        ) : (
          <button
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full bg-[#1677ff] px-4 text-sm font-bold text-white transition hover:bg-[#095fd8]"
            type="button"
            onClick={() => navigate('/login')}
          >
            <LogIn size={16} />
            <span>\u767b\u5f55</span>
          </button>
        )}
      </nav>
    </header>
  );
}
