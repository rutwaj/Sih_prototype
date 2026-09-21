"use client";

import { useSimStore } from "@/store/simStore";
import { Volume2, VolumeX, Activity } from "lucide-react";

/**
 * TopBar — 48px tall bar fixed at top.
 * Shows: app label, network status, sim clock, sound toggle.
 */
export default function TopBar() {
  const { muted, setMuted, simClock, soundEnabled, setSoundEnabled, networkStatus } =
    useSimStore();

  return (
    <header className="flex items-center h-12 px-4 border-b border-line bg-surface flex-shrink-0 gap-4">
      {/* Spacer for left rail width */}
      <div className="w-8 flex-shrink-0" />

      {/* App name */}
      <span className="text-sm font-medium text-text tracking-wide">
        ResiliNet-AI
      </span>
      <span className="text-xs text-faint border border-line rounded-sm px-2 py-0.5">
        SIMULATION
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Network status indicators */}
      <div className="flex items-center gap-3">
        <NetworkIndicator label="Grid" active={networkStatus.gridUp} />
        <NetworkIndicator label="Cell" active={networkStatus.cellUp} />
        <NetworkIndicator label="LoRa" active={networkStatus.loraUp} />
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-line" />

      {/* Sim clock */}
      <div className="flex items-center gap-1.5">
        <Activity size={12} strokeWidth={1.5} className="text-faint" />
        <span className="font-mono text-xs text-muted tabular-nums">
          {simClock}
        </span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-line" />

      {/* Sound enable / mute */}
      {!soundEnabled ? (
        <button
          onClick={() => setSoundEnabled(true)}
          className="flex items-center gap-1.5 text-xs text-accent border border-accent rounded-md px-2 py-1 hover:bg-accent hover:text-bg transition-colors duration-fast"
          aria-label="Enable sound alerts"
        >
          <Volume2 size={12} strokeWidth={1.5} />
          Enable sound
        </button>
      ) : (
        <button
          onClick={() => setMuted(!muted)}
          className="flex items-center justify-center w-7 h-7 rounded-md text-faint hover:text-text hover:bg-surface-2 transition-colors duration-fast"
          aria-label={muted ? "Unmute" : "Mute"}
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <VolumeX size={14} strokeWidth={1.5} />
          ) : (
            <Volume2 size={14} strokeWidth={1.5} />
          )}
        </button>
      )}
    </header>
  );
}

/** Dot + label connectivity indicator */
function NetworkIndicator({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-ok" : "bg-critical"}`}
        aria-hidden="true"
      />
      <span className="text-xs text-muted font-mono">{label}</span>
    </div>
  );
}
