import type { ComponentProps } from 'react';
import {
  ButtonShowcase,
  DemoFrame,
  PromptCard,
  SwatchGrid,
} from './components/mdx';

export const mdxComponents = {
  DemoFrame,
  ButtonShowcase,
  SwatchGrid,
  PromptCard,
  h2: (props: ComponentProps<'h2'>) => (
    <h2 className="mb-[18px] mt-12 text-[30px] font-bold tracking-normal text-[#111827]" {...props} />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="mb-3.5 mt-8 text-[22px] font-bold tracking-normal text-[#111827]" {...props} />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p className="text-[17px] leading-[1.9] text-[#111827]" {...props} />
  ),
  li: (props: ComponentProps<'li'>) => (
    <li className="text-[17px] leading-[1.9] text-[#111827]" {...props} />
  ),
};
