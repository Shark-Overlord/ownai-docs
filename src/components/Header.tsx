import {
  Search,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../pages/assert/image/logo.png';

const navItems = [
  { to: '/design', label: '\u8bbe\u8ba1' },
  { to: '/components', label: '\u7ec4\u4ef6' },
  { to: '/resources', label: '\u8d44\u6e90' },
];

export function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <header className="sticky top-0 z-20 flex min-h-[64px] items-center border-b border-[#f0f0f0] bg-white/95 px-12 backdrop-blur-xl max-[1100px]:flex-wrap max-[1100px]:gap-4 max-[1100px]:px-6 max-[1100px]:py-4">
      <a className="inline-flex min-w-[190px] items-center gap-2.5 text-[22px] font-bold leading-none text-[#202124] no-underline" href="/">
        <img src={logo} alt="" style={{ width: 32, height: 32 }} />
        <span>OwnAI</span>
      </a>

      <form
        className="ml-auto mr-12 flex h-9 w-[300px] items-center gap-2.5 rounded-full bg-[#f7f8fa] px-3.5 text-[#b8c0cc] max-[1100px]:order-3 max-[1100px]:mx-0 max-[1100px]:w-full"
        role="search"
        onSubmit={handleSubmit}
      >
        <Search style={{ width: 17, height: 17 }} strokeWidth={2.2} />
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
                'relative inline-flex h-[64px] items-center whitespace-nowrap text-base font-medium no-underline max-[1100px]:h-10',
                isActive ? 'text-[#111827] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#1677ff]' : 'text-[#202124]',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
