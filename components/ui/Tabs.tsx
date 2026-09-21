"use client";

/**
 * components/ui/Tabs.tsx
 * Horizontal tab strip. Controlled component.
 */

interface Tab<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (id: T) => void;
  size?: "sm" | "md";
}

export default function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  size = "md",
}: TabsProps<T>) {
  const sizeClass = size === "sm" ? "text-xs h-7 px-3" : "text-sm h-8 px-4";

  return (
    <div className="flex border-b border-line" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              "inline-flex items-center font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
              sizeClass,
              isActive
                ? "text-text border-b-2 border-accent -mb-px"
                : "text-muted hover:text-text border-b-2 border-transparent -mb-px",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
