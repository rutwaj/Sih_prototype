/**
 * components/ui/Panel.tsx
 * A bordered surface container. No nesting — just one level of surface.
 */

import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export default function Panel({ title, children, className = "", actions }: PanelProps) {
  return (
    <section className={`bg-surface border border-line rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-line">
          <h2 className="text-sm font-medium text-text">{title}</h2>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
