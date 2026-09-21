"use client";

/**
 * components/map/NodeDetailPanel.tsx
 * Right-side overlay panel showing details for the selected node.
 * Dismissible. Shows sensors, battery, connectivity, and recent events.
 */

import { X, Zap, Wifi, Battery, Radio, Flame, Droplets } from "lucide-react";
import { useSimStore } from "@/store/simStore";
import { NODES } from "@/data/nodes";
import Badge from "@/components/ui/Badge";
import Stat from "@/components/ui/Stat";

export default function NodeDetailPanel() {
  const selectedNodeId = useSimStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useSimStore((s) => s.setSelectedNodeId);
  const events = useSimStore((s) => s.events);

  if (!selectedNodeId) return null;

  const node = NODES.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const nodeEvents = events
    .filter((e) => e.nodeId === selectedNodeId)
    .slice(0, 5);

  return (
    <div className="absolute top-4 right-4 z-[1000] w-72 bg-surface border border-line rounded-lg overflow-hidden shadow-none">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
        {node.type === "WildSentry" ? (
          <Flame size={14} strokeWidth={1.5} className="text-warn flex-shrink-0" />
        ) : (
          <Droplets size={14} strokeWidth={1.5} className="text-info flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text truncate">{node.name}</p>
          <p className="text-xs text-muted font-mono">{node.id} · {node.region}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status={node.status} />
          <button
            onClick={() => setSelectedNodeId(null)}
            className="flex items-center justify-center w-6 h-6 rounded-sm text-faint hover:text-text hover:bg-surface-2 transition-colors duration-fast"
            aria-label="Close detail panel"
          >
            <X size={12} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-line">
        <div className="bg-surface px-3 py-2">
          <Stat
            label="Battery"
            value={`${node.battery}%`}
            icon={<Battery size={12} strokeWidth={1.5} />}
            valueClassName={node.battery < 20 ? "text-critical" : node.battery < 40 ? "text-warn" : "text-ok"}
          />
        </div>
        <div className="bg-surface px-3 py-2">
          <Stat
            label="Solar"
            value={`${node.solar}W`}
            icon={<Zap size={12} strokeWidth={1.5} />}
          />
        </div>
        <div className="bg-surface px-3 py-2">
          <Stat
            label="Link"
            value={node.signal.toUpperCase()}
            icon={node.signal === "lora"
              ? <Radio size={12} strokeWidth={1.5} />
              : <Wifi size={12} strokeWidth={1.5} />}
          />
        </div>
      </div>

      {/* Sensor readings */}
      <div className="px-4 py-3 border-b border-line">
        <p className="text-xs text-faint uppercase tracking-wide mb-2">Sensors</p>
        {node.type === "WildSentry" ? (
          <div className="space-y-1">
            <SensorRow label="Acoustic" value={`${node.sensors.acoustic} dB`} baseline={35} anomaly={70} current={node.sensors.acoustic ?? 0} />
            <SensorRow label="Thermal" value={`${node.sensors.thermal}°C`} baseline={30} anomaly={60} current={node.sensors.thermal ?? 0} />
            <SensorRow label="Smoke" value={`${node.sensors.smoke} ppm`} baseline={10} anomaly={50} current={node.sensors.smoke ?? 0} />
          </div>
        ) : (
          <div className="space-y-1">
            <SensorRow label="Water level" value={`${node.sensors.waterLevel} cm`} baseline={100} anomaly={200} current={node.sensors.waterLevel ?? 0} />
            <SensorRow label="Rate of rise" value={`${node.sensors.rateOfRise} cm/min`} baseline={2} anomaly={5} current={node.sensors.rateOfRise ?? 0} />
            <SensorRow label="Turbidity" value={`${node.sensors.turbidity} NTU`} baseline={20} anomaly={100} current={node.sensors.turbidity ?? 0} />
          </div>
        )}
      </div>

      {/* Recent events */}
      <div className="px-4 py-3">
        <p className="text-xs text-faint uppercase tracking-wide mb-2">Recent events</p>
        {nodeEvents.length === 0 ? (
          <p className="text-xs text-faint italic">No events yet</p>
        ) : (
          <ol className="space-y-1">
            {nodeEvents.map((e) => (
              <li key={e.id} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    e.severity === "critical"
                      ? "bg-critical"
                      : e.severity === "warn"
                      ? "bg-warn"
                      : "bg-info"
                  }`}
                />
                <span className="text-xs text-muted leading-snug">{e.message}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

/** A single sensor row with a normalised bar indicator */
function SensorRow({
  label,
  value,
  baseline,
  anomaly,
  current,
}: {
  label: string;
  value: string;
  baseline: number;
  anomaly: number;
  current: number;
}) {
  const ratio = Math.min(current / anomaly, 1);
  const isWarn = current > baseline;
  const isCritical = current > anomaly * 0.8;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-surface-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-base ${
            isCritical ? "bg-critical" : isWarn ? "bg-warn" : "bg-ok"
          }`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span className="text-xs font-mono text-text w-20 text-right flex-shrink-0">
        {value}
      </span>
    </div>
  );
}
