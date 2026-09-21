"use client";

/**
 * components/sim/SimControlPanel.tsx
 * Right-hand panel: scenario buttons, speed control, pause, event log.
 * Phase 4 will wire the actual simulation engine here.
 * Phase 3 stub: renders the full UI, but buttons only update store flags.
 */

import { useState } from "react";
import {
  Flame,
  MountainSnow,
  Droplets,
  Radio,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import Tabs from "@/components/ui/Tabs";
import TimelineRow from "@/components/ui/TimelineRow";
import { useSimStore } from "@/store/simStore";

type TabId = "controls" | "events";
type SpeedValue = 1 | 2 | 4;

const SCENARIOS = [
  {
    id: "forest_fire" as const,
    label: "Forest Fire",
    icon: <Flame size={13} strokeWidth={1.5} />,
    variant: "danger" as const,
  },
  {
    id: "landslide" as const,
    label: "Landslide",
    icon: <MountainSnow size={13} strokeWidth={1.5} />,
    variant: "ghost" as const,
  },
  {
    id: "flash_flood" as const,
    label: "Flash Flood",
    icon: <Droplets size={13} strokeWidth={1.5} />,
    variant: "ghost" as const,
  },
] as const;

const SPEED_OPTIONS: SpeedValue[] = [1, 2, 4];

export default function SimControlPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("controls");

  const {
    simRunning,
    simSpeed,
    setSimRunning,
    setSimSpeed,
    resetSim,
    networkStatus,
    setNetworkStatus,
    events,
  } = useSimStore();

  function handleScenario(scenarioId: string) {
    // Phase 4: will call the simulation engine
    // For now, just start the sim clock
    setSimRunning(true);
    console.log("Scenario triggered:", scenarioId);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "controls", label: "Controls" },
          { id: "events", label: `Events${events.length > 0 ? ` (${events.length})` : ""}` },
        ]}
        active={activeTab}
        onChange={setActiveTab}
        size="sm"
      />

      {activeTab === "controls" ? (
        <div className="flex flex-col flex-1 overflow-y-auto p-4 gap-4">
          {/* Scenarios */}
          <div>
            <p className="text-xs text-faint uppercase tracking-wide mb-2">Scenarios</p>
            <div className="flex flex-col gap-1.5">
              {SCENARIOS.map((s) => (
                <Button
                  key={s.id}
                  variant={s.variant}
                  size="sm"
                  icon={s.icon}
                  onClick={() => handleScenario(s.id)}
                  disabled={simRunning}
                  className="justify-start"
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-line" />

          {/* Connectivity toggles */}
          <div>
            <p className="text-xs text-faint uppercase tracking-wide mb-2">Connectivity</p>
            <div className="flex flex-col gap-2">
              <Toggle
                checked={networkStatus.gridUp}
                onChange={(v) => setNetworkStatus({ gridUp: v })}
                label="Grid power"
              />
              <Toggle
                checked={networkStatus.cellUp}
                onChange={(v) => setNetworkStatus({ cellUp: v })}
                label="Cell tower"
              />
              <Toggle
                checked={networkStatus.loraUp}
                onChange={(v) => setNetworkStatus({ loraUp: v })}
                label="LoRa mesh"
                disabled={true}  // LoRa always works (solar-powered)
              />
            </div>
            <p className="text-xs text-faint mt-2 leading-snug">
              LoRa mesh is solar-powered — it stays online even when grid and cell fail.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-line" />

          {/* Speed + pause/play */}
          <div>
            <p className="text-xs text-faint uppercase tracking-wide mb-2">Sim speed</p>
            <div className="flex items-center gap-1.5 mb-3">
              {SPEED_OPTIONS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimSpeed(speed)}
                  className={[
                    "flex-1 h-7 rounded-md text-xs font-mono font-medium border transition-colors duration-fast",
                    simSpeed === speed
                      ? "bg-accent text-bg border-accent"
                      : "bg-transparent text-muted border-line hover:text-text hover:bg-surface-2",
                  ].join(" ")}
                >
                  {speed}×
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                icon={simRunning ? <Pause size={13} strokeWidth={1.5} /> : <Play size={13} strokeWidth={1.5} />}
                onClick={() => setSimRunning(!simRunning)}
                className="flex-1 justify-center"
                disabled={false}
              >
                {simRunning ? "Pause" : "Resume"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<RotateCcw size={13} strokeWidth={1.5} />}
                onClick={resetSim}
                className="flex-1 justify-center"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-y-auto p-4">
          {events.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
              <Radio size={20} strokeWidth={1.5} className="text-faint" />
              <p className="text-sm text-muted">No events yet.</p>
              <p className="text-xs text-faint">Trigger a scenario to see the event log.</p>
            </div>
          ) : (
            <ol className="space-y-0">
              {events.map((event, i) => (
                <TimelineRow
                  key={event.id}
                  label={event.message}
                  timestamp={new Date(event.timestamp).toLocaleTimeString()}
                  status={
                    event.severity === "critical"
                      ? "critical"
                      : event.severity === "warn"
                      ? "warn"
                      : "info"
                  }
                  isLast={i === events.length - 1}
                />
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
