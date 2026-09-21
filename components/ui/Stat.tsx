/**
 * components/ui/Stat.tsx
 * Stat display: a labelled number/value in mono font.
 * Used for battery %, solar W, signal strength, counters.
 */

import type { ReactNode } from "react";

interface StatProps {
  label: string;
  value: string;
  icon?: ReactNode;
  valueClassName?: string;
  sublabel?: string;
}

export default function Stat({
  label,
  value,
  icon,
  valueClassName = "text-text",
  sublabel,
}: StatProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {/* Label row */}
      <div className="flex items-center gap-1 text-faint">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="text-xs uppercase tracking-wide truncate">{label}</span>
      </div>
      {/* Value */}
      <span className={`font-mono text-sm font-medium tabular-nums ${valueClassName}`}>
        {value}
      </span>
      {/* Optional sub-label */}
      {sublabel && (
        <span className="text-xs text-faint">{sublabel}</span>
      )}
    </div>
  );
}
