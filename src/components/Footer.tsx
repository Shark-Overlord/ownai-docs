import { Link } from 'react-router-dom';
import logo from '../pages/assert/image/logo.png';

const footerLinks = [
  {
    title: '\u5185\u5bb9',
    links: [
      { to: '/design', label: '\u8bbe\u8ba1' },
      { to: '/components', label: '\u7ec4\u4ef6' },
      { to: '/resources', label: '\u8d44\u6e90' },
    ],
  },
  {
    title: '\u8d44\u4ea7',
    links: [
      { to: '/components', label: 'React Components' },
      { to: '/design', label: 'Design System' },
      { to: '/resources', label: 'Prompt Library' },
    ],
  },
  {
    title: '\u6269\u5c55',
    links: [
      { to: '/resources', label: '\u77e5\u8bc6\u5e93' },
      { to: '/resources', label: '\u6a21\u677f' },
      { to: '/resources', label: '\u5de5\u5177' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#eef1f5] bg-white px-12 py-10 text-[#50617a] max-[760px]:px-6">
      <div className="grid grid-cols-[minmax(260px,1fr)_2fr] gap-12 max-[900px]:grid-cols-1">
        <div>
          <Link className="group inline-flex items-center gap-2.5 text-[22px] font-bold leading-none text-[#111827] no-underline transition-transform duration-300 hover:-translate-y-[1px]" to="/">
            <img src={logo} alt="" style={{ width: 30, height: 30 }} />
            <span className="animate-breath bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">OwnAI</span>
          </Link>
          <p className="mt-4 max-w-[420px] text-sm leading-7">
            {'\u6c89\u6dc0 UI\u3001\u4ee3\u7801\u3001\u63d0\u793a\u8bcd\u4e0e\u8bbe\u8ba1\u8d44\u4ea7\uff0c\u8ba9\u6bcf\u4e00\u6b21\u521b\u4f5c\u90fd\u53ef\u4ee5\u590d\u7528\u4e0e\u589e\u957f\u3002'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 max-[760px]:grid-cols-1">
          {footerLinks.map((group) => (
            <nav className="group grid gap-3" key={group.title} aria-label={group.title}>
              <strong className="text-sm text-[#111827]">{group.title}</strong>
              {group.links.map((item) => (
                <Link className="text-sm text-[#50617a] no-underline transition-all duration-300 hover:text-blue-600 group-hover:opacity-40 hover:!opacity-100" to={item.to} key={item.label}>
                  {item.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-[#eef1f5] pt-6 text-xs text-[#8a94a3] max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-3">
        <span>{'\u00a9 2026 OwnAI. All rights reserved.'}</span>
        <span>{'\u6784\u5efa\u5c5e\u4e8e\u4f60\u7684\u6570\u5b57\u77e5\u8bc6\u8d44\u4ea7'}</span>
      </div>
    </footer>
  );
}
