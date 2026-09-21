"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  BarChart3,
  Cpu,
  Terminal,
  Info,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Map, label: "Live Map" },
  { href: "/compare", icon: BarChart3, label: "Compare" },
  { href: "/hardware", icon: Cpu, label: "Hardware" },
  { href: "/hardware-lab", icon: Terminal, label: "Hardware Lab" },
  { href: "/about", icon: Info, label: "About" },
] as const;

/**
 * LeftRail — 48px icon-only nav rail.
 * Hover shows tooltip label to the right.
 */
export default function LeftRail() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="flex flex-col items-center w-12 border-r border-line bg-surface flex-shrink-0 py-3 gap-1"
    >
      {/* Logo mark */}
      <Link
        href="/"
        aria-label="ResiliNet-AI home"
        className="flex items-center justify-center w-8 h-8 rounded-md bg-accent text-bg font-mono font-bold text-sm mb-3 flex-shrink-0"
      >
        R
      </Link>

      {/* Divider */}
      <div className="w-6 border-t border-line mb-2" />

      {/* Nav items */}
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            title={label}
            className={[
              "group relative flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-fast",
              isActive
                ? "bg-surface-2 text-accent"
                : "text-faint hover:text-text hover:bg-surface-2",
            ].join(" ")}
          >
            <Icon size={16} strokeWidth={1.5} />

            {/* Tooltip */}
            <span
              className="
                pointer-events-none absolute left-full ml-2 z-50
                px-2 py-1 rounded-sm bg-surface-2 border border-line
                text-xs text-text whitespace-nowrap
                opacity-0 translate-x-1
                group-hover:opacity-100 group-hover:translate-x-0
                transition-all duration-fast
              "
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
