/**
 * components/ui/Badge.tsx
 * Status badge — used for node status, alert severity, etc.
 * Never used decoratively — always carries semantic meaning.
 */

import type { NodeStatus } from "@/data/nodes";

type BadgeVariant = NodeStatus | "info" | "muted";

interface BadgeProps {
  status: BadgeVariant;
  label?: string;        // override default label
  size?: "sm" | "xs";
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  ok:       "bg-ok/10 text-ok border-ok/30",
  warn:     "bg-warn/10 text-warn border-warn/30",
  critical: "bg-critical/10 text-critical border-critical/30",
  offline:  "bg-faint/10 text-faint border-faint/30",
  info:     "bg-info/10 text-info border-info/30",
  muted:    "bg-surface-2 text-muted border-line",
};

const DEFAULT_LABELS: Record<BadgeVariant, string> = {
  ok:       "OK",
  warn:     "WARN",
  critical: "ALERT",
  offline:  "OFFLINE",
  info:     "INFO",
  muted:    "—",
};

export default function Badge({ status, label, size = "xs" }: BadgeProps) {
  const text = label ?? DEFAULT_LABELS[status];
  const sizeClass = size === "sm" ? "text-sm px-2 py-0.5" : "text-xs px-1.5 py-0.5";

  return (
    <span
      className={`
        inline-flex items-center font-mono font-medium tracking-wide
        border rounded-sm select-none
        ${sizeClass}
        ${VARIANT_STYLES[status]}
      `}
    >
      {text}
    </span>
  );
}
