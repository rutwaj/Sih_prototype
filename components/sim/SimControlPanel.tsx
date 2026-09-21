"use client";

/**
 * components/sim/SimControlPanel.tsx
 * Right-hand panel: scenario buttons, speed control, pause, event log.
 * Wired to the simulation engine (lib/simulation.ts) and Zustand store.
 */

import { useCallback, useEffect, useRef, useState } from "react";
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
import { runScenario, type ScenarioResult } from "@/lib/simulation";
import type { ScenarioId } from "@/data/messages";

type TabId = "controls" | "events";
type SpeedValue = 1 | 2 | 4;

const SCENARIOS: Array<{
  id: ScenarioId;
  label: string;
  icon: React.ReactNode;
  variant: "default" | "ghost" | "danger";
}> = [
  {
    id: "forest_fire",
    label: "Forest Fire",
    icon: <Flame size={13} strokeWidth={1.5} />,
    variant: "danger",
  },
  {
    id: "landslide",
    label: "Landslide",
    icon: <MountainSnow size={13} strokeWidth={1.5} />,
    variant: "ghost",
  },
  {
    id: "flash_flood",
    label: "Flash Flood",
    icon: <Droplets size={13} strokeWidth={1.5} />,
    variant: "ghost",
  },
];

const SPEED_OPTIONS: SpeedValue[] = [1, 2, 4];

export default function SimControlPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("controls");

  const {
    nodes,
    simRunning,
    simSpeed,
    setSimRunning,
    setSimSpeed,
    resetSim,
    networkStatus,
    setNetworkStatus,
    events,
    addEvent,
    clearEvents,
    updateNodeStatus,
    setActiveAlert,
  } = useSimStore();

  // Pending replay queue: sorted events scheduled to fire
  const pendingRef = useRef<Array<{ at: number; idx: number }>>([]);
  const resultRef = useRef<ScenarioResult | null>(null);
  const startWallRef = useRef<number>(0);
  const pausedAtRef = useRef<number | null>(null); // wall-clock when paused
  const accumulatedRef = useRef<number>(0); // total time already consumed before pause

  /** Clear timers and replay state */
  const clearReplay = useCallback(() => {
    pendingRef.current = [];
    resultRef.current = null;
  }, []);

  /** Trigger a scenario */
  const handleScenario = useCallback(
    (scenarioId: ScenarioId) => {
      if (nodes.length === 0) return;

      clearReplay();
      clearEvents();
      setActiveAlert(null);

      const result = runScenario(scenarioId, nodes, networkStatus, new Date());
      resultRef.current = result;

      // Convert event timestamps → relative ms offsets from first event
      const firstTs = new Date(result.events[0]?.timestamp ?? Date.now()).getTime();
      pendingRef.current = result.events.map((_, idx) => ({
        at: new Date(result.events[idx].timestamp).getTime() - firstTs,
        idx,
      }));

      startWallRef.current = Date.now();
      accumulatedRef.current = 0;
      pausedAtRef.current = null;

      setSimRunning(true);
      setActiveTab("events");

      // Set origin node to warning state immediately
      updateNodeStatus(result.originNodeId, "warn");

      // Set the active alert in store
      setActiveAlert({
        scenarioId,
        triggeredAt: new Date().toISOString(),
        affectedNodeIds: [result.originNodeId],
        phase: "detecting",
        confidence: 0,
      });
    },
    [nodes, networkStatus, clearReplay, clearEvents, setActiveAlert, setSimRunning, updateNodeStatus],
  );

  /** Replay tick: drain pending events based on elapsed sim time */
  useEffect(() => {
    if (!simRunning) return;

    const tickInterval = setInterval(() => {
      const result = resultRef.current;
      if (!result || pendingRef.current.length === 0) {
        setSimRunning(false);
        return;
      }

      const elapsed =
        accumulatedRef.current +
        (Date.now() - startWallRef.current) * simSpeed;

      // Fire all events whose offset has been reached
      const remaining: typeof pendingRef.current = [];
      for (const item of pendingRef.current) {
        if (item.at <= elapsed) {
          const event = result.events[item.idx];
          addEvent(event);

          // Update node status based on event type
          if (event.type === "sensor_confirmed") {
            updateNodeStatus(event.nodeId, "critical");
            setActiveAlert({
              scenarioId: result.events[0].message.includes("Forest Fire")
                ? "forest_fire"
                : result.events[0].message.includes("Flash Flood")
                ? "flash_flood"
                : "landslide",
              triggeredAt: event.timestamp,
              affectedNodeIds: [result.originNodeId],
              phase: "confirmed",
              confidence: 94,
            });
          } else if (event.type === "mesh_hop") {
            updateNodeStatus(event.nodeId, "warn");
            // Add newly-affected nodes to alert
            setActiveAlert((prev) =>
              prev
                ? {
                    ...prev,
                    affectedNodeIds: [...new Set([...prev.affectedNodeIds, event.nodeId])],
                    phase: "propagating",
                  }
                : prev,
            );
          } else if (event.type === "sensor_anomaly") {
            updateNodeStatus(event.nodeId, "warn");
          }
        } else {
          remaining.push(item);
        }
      }
      pendingRef.current = remaining;

      if (remaining.length === 0) {
        setSimRunning(false);
      }
    }, 100);

    return () => clearInterval(tickInterval);
  }, [simRunning, simSpeed, addEvent, updateNodeStatus, setActiveAlert, setSimRunning]);

  /** Handle pause / resume */
  const handlePauseResume = useCallback(() => {
    if (simRunning) {
      // Pausing: record accumulated time
      accumulatedRef.current += (Date.now() - startWallRef.current) * simSpeed;
      pausedAtRef.current = Date.now();
      setSimRunning(false);
    } else {
      // Resuming
      startWallRef.current = Date.now();
      setSimRunning(true);
    }
  }, [simRunning, simSpeed, setSimRunning]);

  /** Full reset */
  const handleReset = useCallback(() => {
    clearReplay();
    resetSim();
  }, [clearReplay, resetSim]);

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
                onChange={() => {}}
                label="LoRa mesh"
                disabled={true}
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
                onClick={handlePauseResume}
                className="flex-1 justify-center"
              >
                {simRunning ? "Pause" : "Resume"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<RotateCcw size={13} strokeWidth={1.5} />}
                onClick={handleReset}
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
