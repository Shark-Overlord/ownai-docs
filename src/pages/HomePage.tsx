import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import homeBg from './assert/image/bg.png';

export function HomePage() {
  return (
    <>
      <main
        className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-cover bg-center bg-no-repeat pl-[141px] pt-[164px] max-[760px]:px-6 max-[760px]:pt-[72px]"
        style={{ backgroundImage: `url(${homeBg})`, backgroundPosition: 'center bottom' }}
      >
        <section className="max-w-[680px]">
          <h1 className="animate-fade-in-up grid gap-3 text-[60px] font-extrabold leading-[1.18] tracking-normal text-[#111b31] max-[760px]:text-[42px]">
            <span>{'\u6784\u5efa\u5c5e\u4e8e\u4f60\u7684'}</span>
            <span>
              {'\u6570\u5b57'}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{'\u77e5\u8bc6\u8d44\u4ea7'}</span>
            </span>
          </h1>
          <p className="animate-fade-in-up [animation-delay:150ms] mt-6 max-w-[600px] text-lg leading-[1.9] text-[#50617a]">
            {'\u4ee5\u6587\u6863\u4e3a\u6838\u5fc3\uff0c\u6c89\u6dc0\u4ea7\u54c1\u601d\u8def\u3001\u4ee3\u7801\u3001\u63d0\u793a\u8bcd\u4e0e\u8bbe\u8ba1\u8d44\u4ea7\uff0c'}
            <br />
            {'\u8ba9\u77e5\u8bc6\u6301\u7eed\u590d\u7528\u4e0e\u589e\u957f\u3002'}
          </p>
          <div className="animate-fade-in-up [animation-delay:300ms] mt-11 flex flex-wrap items-center gap-4">
            <Link
              className="group inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6aa6ff] to-[#3e79f5] text-white no-underline shadow-[0_12px_26px_rgba(64,124,245,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(64,124,245,0.4)]"
              to="/components"
              aria-label="\u5f00\u59cb\u9605\u8bfb\u6587\u6863"
            >
              <ArrowRight style={{ width: 23, height: 23 }} strokeWidth={2.4} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link className="group text-base font-bold text-[#15223a] no-underline transition-colors hover:text-[#3e79f5]" to="/components">
              {'\u5f00\u59cb\u9605\u8bfb\u6587\u6863'}
            </Link>
            <i className="block h-5 w-px bg-[#d5dce8]" aria-hidden="true" />
            <Link className="group inline-flex items-center text-base font-bold text-[#15223a] no-underline transition-colors hover:text-[#3e79f5]" to="/resources">
              {'\u4e86\u89e3 OwnAI '}
              <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">›</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
