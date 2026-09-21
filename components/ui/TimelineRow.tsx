/**
 * components/ui/TimelineRow.tsx
 * A single row in a timeline — icon, label, timestamp, optional badge.
 * Used in the detection timeline and event log.
 */

import type { ReactNode } from "react";
import type { NodeStatus } from "@/data/nodes";
import Badge from "./Badge";

interface TimelineRowProps {
  icon?: ReactNode;
  label: string;
  timestamp?: string;
  detail?: string;
  status?: NodeStatus | "info" | "muted";
  isLast?: boolean;
}

export default function TimelineRow({
  icon,
  label,
  timestamp,
  detail,
  status,
  isLast = false,
}: TimelineRowProps) {
  return (
    <li className="flex gap-3 relative">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-3 top-5 bottom-0 w-px bg-line" aria-hidden="true" />
      )}

      {/* Icon dot */}
      <div className="flex-shrink-0 w-6 h-6 rounded-full border border-line bg-surface-2 flex items-center justify-center z-10">
        {icon ? (
          <span className="text-muted">{icon}</span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-faint" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-3 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-text leading-tight">{label}</span>
          {status && <Badge status={status} />}
        </div>
        {detail && (
          <p className="text-xs text-muted mt-0.5 leading-snug">{detail}</p>
        )}
        {timestamp && (
          <time className="font-mono text-xs text-faint mt-0.5 block">
            {timestamp}
          </time>
        )}
      </div>
    </li>
  );
}
