"use client";

/**
 * app/styleguide/page.tsx
 * Hidden route showing all UI primitives — the consistency anchor.
 * Not linked in nav; access at /styleguide.
 */

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import Stat from "@/components/ui/Stat";
import Tabs from "@/components/ui/Tabs";
import Toggle from "@/components/ui/Toggle";
import Tooltip from "@/components/ui/Tooltip";
import TimelineRow from "@/components/ui/TimelineRow";
import { Flame, Zap, Battery, Wifi } from "lucide-react";

type TabId = "colors" | "type" | "components";

export default function StyleguidePage() {
  const [activeTab, setActiveTab] = useState<TabId>("colors");
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-text">Design System Styleguide</h1>
        <p className="text-sm text-muted mt-1">
          All primitives. Used as the consistency anchor — every component must look
          right here before being used in production screens.
        </p>
      </div>

      <Tabs
        tabs={[
          { id: "colors", label: "Colors & Tokens" },
          { id: "type", label: "Typography" },
          { id: "components", label: "Components" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "colors" && (
        <div className="space-y-6">
          <Section title="Color palette">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {[
                { name: "bg", cls: "bg-bg" },
                { name: "surface", cls: "bg-surface" },
                { name: "surface-2", cls: "bg-surface-2" },
                { name: "line", cls: "bg-line" },
                { name: "text", cls: "bg-text" },
                { name: "muted", cls: "bg-muted" },
                { name: "faint", cls: "bg-faint" },
                { name: "accent", cls: "bg-accent" },
                { name: "ok", cls: "bg-ok" },
                { name: "warn", cls: "bg-warn" },
                { name: "critical", cls: "bg-critical" },
                { name: "info", cls: "bg-info" },
              ].map(({ name, cls }) => (
                <div key={name} className="space-y-1">
                  <div className={`${cls} h-10 rounded-md border border-line`} />
                  <p className="text-xs font-mono text-muted">{name}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Badges (semantic only)">
            <div className="flex flex-wrap gap-2">
              <Badge status="ok" />
              <Badge status="warn" />
              <Badge status="critical" />
              <Badge status="offline" />
              <Badge status="info" />
              <Badge status="muted" />
              <Badge status="ok" label="Node healthy" size="sm" />
              <Badge status="critical" label="Fire confirmed" size="sm" />
            </div>
          </Section>
        </div>
      )}

      {activeTab === "type" && (
        <div className="space-y-6">
          <Section title="Type scale">
            <div className="space-y-3">
              <p className="text-2xl font-semibold text-text">2xl / 28px — Hero KPI</p>
              <p className="text-xl font-semibold text-text">xl / 20px — Page header</p>
              <p className="text-lg font-medium text-text">lg / 16px — Section header</p>
              <p className="text-base text-text">base / 14px — Body text, descriptions</p>
              <p className="text-sm text-muted">sm / 13px — Labels, nav, secondary</p>
              <p className="text-xs text-faint">xs / 12px — Captions, metadata, timestamps</p>
            </div>
          </Section>
          <Section title="Mono (JetBrains Mono)">
            <div className="space-y-2">
              <p className="font-mono text-xl text-text tabular-nums">14:32:07</p>
              <p className="font-mono text-base text-text tabular-nums">WS-014 · Nainital Ridge</p>
              <p className="font-mono text-sm text-muted tabular-nums">Water level +42 cm / 10 min</p>
              <p className="font-mono text-xs text-faint tabular-nums">2026-09-21T06:37:00Z</p>
            </div>
          </Section>
        </div>
      )}

      {activeTab === "components" && (
        <div className="space-y-6">
          <Section title="Buttons">
            <div className="flex flex-wrap gap-2 items-center">
              <Button variant="default" size="md">Primary action</Button>
              <Button variant="ghost" size="md">Ghost</Button>
              <Button variant="danger" size="md" icon={<Flame size={13} strokeWidth={1.5} />}>
                Trigger Fire
              </Button>
              <Button variant="default" size="sm">Small default</Button>
              <Button variant="ghost" size="sm">Small ghost</Button>
              <Button variant="default" size="md" loading>Loading</Button>
              <Button variant="ghost" size="md" disabled>Disabled</Button>
            </div>
          </Section>

          <Section title="Stats">
            <div className="flex gap-8">
              <Stat label="Battery" value="87%" icon={<Battery size={12} strokeWidth={1.5} />} valueClassName="text-ok" />
              <Stat label="Solar" value="14.2 W" icon={<Zap size={12} strokeWidth={1.5} />} />
              <Stat label="Link" value="CELL" icon={<Wifi size={12} strokeWidth={1.5} />} />
              <Stat label="Water level" value="+42 cm" sublabel="vs. baseline" valueClassName="text-warn" />
            </div>
          </Section>

          <Section title="Panel">
            <Panel title="Example panel" actions={<Badge status="ok" />}>
              <p className="text-sm text-muted">
                Panel content goes here. One level — no nesting.
              </p>
            </Panel>
          </Section>

          <Section title="Toggles">
            <div className="flex gap-6 flex-wrap">
              <Toggle checked={toggle1} onChange={setToggle1} label="Grid power (on)" />
              <Toggle checked={toggle2} onChange={setToggle2} label="Cell tower (off)" />
              <Toggle checked={true} onChange={() => {}} label="LoRa mesh (always on)" disabled />
            </div>
          </Section>

          <Section title="Tooltip">
            <div className="flex gap-6">
              <Tooltip content="Top tooltip" side="top">
                <Button variant="ghost" size="sm">Hover me (top)</Button>
              </Tooltip>
              <Tooltip content="Bottom tooltip" side="bottom">
                <Button variant="ghost" size="sm">Hover me (bottom)</Button>
              </Tooltip>
              <Tooltip content="Right tooltip" side="right">
                <Button variant="ghost" size="sm">Hover me (right)</Button>
              </Tooltip>
            </div>
          </Section>

          <Section title="Timeline">
            <ol className="space-y-0">
              <TimelineRow
                icon={<Flame size={10} strokeWidth={1.5} />}
                label="Acoustic anomaly detected"
                detail="Node WS-001, Nainital Ridge — 78 dB (baseline 35 dB)"
                timestamp="14:32:07"
                status="warn"
              />
              <TimelineRow
                icon={<Flame size={10} strokeWidth={1.5} />}
                label="Thermal verification: 68°C surface"
                detail="Confidence 82% — triggering mesh alert"
                timestamp="14:32:19"
                status="warn"
              />
              <TimelineRow
                icon={<Flame size={10} strokeWidth={1.5} />}
                label="FIRE CONFIRMED — alert propagating"
                detail="Mesh hop 1 → WS-002, WS-003"
                timestamp="14:32:23"
                status="critical"
                isLast
              />
            </ol>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">{title}</h2>
      {children}
    </div>
  );
}
