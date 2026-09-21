/**
 * components/ui/Tooltip.tsx
 * Simple tooltip wrapper — shows content on hover above the trigger.
 * CSS-only (no JS positioning needed for basic use).
 */

import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

const SIDE_CLASSES: Record<NonNullable<TooltipProps["side"]>, string> = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left:   "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right:  "left-full top-1/2 -translate-y-1/2 ml-1.5",
};

export default function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span
        role="tooltip"
        className={[
          "pointer-events-none absolute z-50 px-2 py-1",
          "bg-surface-2 border border-line rounded-sm",
          "text-xs text-text whitespace-nowrap",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-fast",
          SIDE_CLASSES[side],
        ].join(" ")}
      >
        {content}
      </span>
    </span>
  );
}
