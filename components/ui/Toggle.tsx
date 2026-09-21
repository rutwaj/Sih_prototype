"use client";

/**
 * components/ui/Toggle.tsx
 * On/off toggle switch — used for connectivity flags (grid, cell, LoRa).
 */

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none group">
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "relative w-8 h-4 rounded-full border transition-colors duration-fast",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          checked
            ? "bg-accent border-accent"
            : "bg-surface-2 border-line",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-bg transition-transform duration-fast",
            checked ? "translate-x-4" : "translate-x-0",
          ].join(" ")}
        />
      </button>
      <span className={`text-sm ${disabled ? "text-faint" : "text-muted group-hover:text-text"} transition-colors duration-fast`}>
        {label}
      </span>
    </label>
  );
}
