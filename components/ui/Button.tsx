/**
 * components/ui/Button.tsx
 * Button primitive — three variants: default, ghost, danger.
 * Sizes: sm, md. Always uses token classes; no hardcoded values.
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
  loading?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  default:
    "bg-accent text-bg hover:opacity-90 border-transparent",
  ghost:
    "bg-transparent text-text border-line hover:bg-surface-2 hover:text-text",
  danger:
    "bg-critical/10 text-critical border-critical/30 hover:bg-critical/20",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "h-7 px-3 text-xs gap-1.5",
  md: "h-8 px-4 text-sm gap-2",
};

export default function Button({
  variant = "default",
  size = "md",
  icon,
  children,
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center",
        "font-medium rounded-md border",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
