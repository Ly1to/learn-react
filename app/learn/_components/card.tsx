import type { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function Card({ title, children, footer, className = "" }: CardProps) {
  return (
    <article className={`rounded-lg border border-zinc-200 bg-white p-4 ${className}`}>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div className="text-zinc-700">{children}</div>
      {footer && (
        <div className="mt-3 border-t border-zinc-200 pt-2 text-sm">{footer}</div>
      )}
    </article>
  );
}
