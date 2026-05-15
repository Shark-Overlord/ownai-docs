import type { CSSProperties, ReactNode } from 'react';

interface DemoFrameProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DemoFrame({ title, description, children }: DemoFrameProps) {
  return (
    <section className="my-7 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
      <div className="flex justify-between gap-4 border-b border-[#e5e7eb] px-[18px] py-4">
        <strong>{title}</strong>
        {description ? <span className="text-[#6b7280]">{description}</span> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

interface ButtonShowcaseProps {
  labels: string[];
  config?: {
    radius?: number;
    primaryColor?: string;
    states?: Array<'default' | 'hover' | 'disabled'>;
  };
}

export function ButtonShowcase({ labels, config }: ButtonShowcaseProps) {
  const states = config?.states || ['default', 'hover', 'disabled'];
  const color = config?.primaryColor || '#1677ff';
  const radius = config?.radius ?? 8;

  return (
    <div className="grid gap-4">
      {labels.map((label) => (
        <div className="flex flex-wrap gap-3" key={label}>
          {states.map((state) => {
            const isDisabled = state === 'disabled';
            const style: CSSProperties = {
              borderRadius: radius,
              borderColor: isDisabled ? '#d1d5db' : color,
              background: isDisabled ? '#f3f4f6' : color,
              color: isDisabled ? '#9ca3af' : '#ffffff',
              filter: state === 'hover' ? 'brightness(0.94)' : undefined,
            };

            return (
              <button
                key={state}
                type="button"
                className="h-[42px] min-w-[120px] cursor-pointer border text-[15px] disabled:cursor-not-allowed"
                style={style}
                disabled={isDisabled}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface Swatch {
  name: string;
  value: string;
  usage?: string;
}

export function SwatchGrid({ colors }: { colors: Swatch[] }) {
  return (
    <div className="grid grid-cols-4 gap-3.5 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
      {colors.map((color) => (
        <article className="grid gap-2.5 rounded-lg border border-[#e5e7eb] p-3.5" key={color.value}>
          <i className="block h-[72px] rounded-md" style={{ background: color.value }} />
          <strong>{color.name}</strong>
          <code>{color.value}</code>
          {color.usage ? <p className="m-0 text-sm text-[#6b7280]">{color.usage}</p> : null}
        </article>
      ))}
    </div>
  );
}

interface PromptCardProps {
  title: string;
  items: string[];
  meta?: {
    role?: string;
    output?: string;
    constraints?: string[];
  };
}

export function PromptCard({ title, items, meta }: PromptCardProps) {
  return (
    <section className="my-7 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white p-5">
      <div className="mb-4 flex justify-between gap-4 border-b border-[#e5e7eb] pb-4">
        <strong>{title}</strong>
        {meta?.role ? <span className="text-[#6b7280]">{meta.role}</span> : null}
      </div>
      <ul className="m-0 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {meta?.output ? <p className="mt-[18px]">{meta.output}</p> : null}
      {meta?.constraints?.length ? (
        <div className="mt-[18px] flex flex-wrap gap-2">
          {meta.constraints.map((item) => (
            <span className="rounded-md bg-[#f7f8fa] px-2 py-1 text-xs text-[#6b7280]" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
