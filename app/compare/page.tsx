"use client";

/**
 * app/compare/page.tsx
 * Old vs ResiliNet comparison view.
 * Synchronized live simulation of legacy satellite/cloud pipeline vs ResiliNet LoRa edge mesh.
 */

import { useState, useEffect, useRef } from "react";
import {
  Flame,
  Droplets,
  MountainSnow,
  Play,
  Pause,
  RotateCcw,
  ZapOff,
  RadioTower,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Toggle from "@/components/ui/Toggle";
import Stat from "@/components/ui/Stat";
import Panel from "@/components/ui/Panel";
import type { ScenarioId } from "@/data/messages";

interface TimelineStep {
  id: string;
  label: string;
  detail: string;
  timeOffsetSec: number;
  displayTime: string;
  status: "idle" | "in_progress" | "complete" | "failed";
}

const SCENARIOS: Array<{
  id: ScenarioId;
  name: string;
  icon: React.ReactNode;
  description: string;
}> = [
  {
    id: "forest_fire",
    name: "Forest Fire",
    icon: <Flame size={13} strokeWidth={1.5} />,
    description: "Nainital Ridge North (Uttarakhand) — dry pine canopy ignition",
  },
  {
    id: "landslide",
    name: "Landslide",
    icon: <MountainSnow size={13} strokeWidth={1.5} />,
    description: "Mukteshwar Upper Slope (Uttarakhand) — slope instability & micro-tremors",
  },
  {
    id: "flash_flood",
    name: "Flash Flood",
    icon: <Droplets size={13} strokeWidth={1.5} />,
    description: "Guwahati River Gauge S1 (Assam) — rapid upstream surge (+6 cm/min)",
  },
];

function getResiliNetSteps(scenario: ScenarioId): Omit<TimelineStep, "status">[] {
  switch (scenario) {
    case "forest_fire":
      return [
        {
          id: "r1",
          label: "Acoustic anomaly detected",
          detail: "MEMS microphone detects 78 dB crackling pattern (baseline 35 dB)",
          timeOffsetSec: 0.5,
          displayTime: "t + 0.5s",
        },
        {
          id: "r2",
          label: "On-device thermal verification",
          detail: "Qualcomm Edge AI evaluates thermal array: 68 °C canopy surface anomaly",
          timeOffsetSec: 1.2,
          displayTime: "t + 1.2s",
        },
        {
          id: "r3",
          label: "Smoke confirmation & hazard lock",
          detail: "Optical particulate sensor hits 62 ppm; multi-modal confidence 94%",
          timeOffsetSec: 2.5,
          displayTime: "t + 2.5s",
        },
        {
          id: "r4",
          label: "Local siren horn & LED strobe active",
          detail: "110 dB siren + high-intensity flashing beacon triggered locally",
          timeOffsetSec: 2.6,
          displayTime: "t + 2.6s",
        },
        {
          id: "r5",
          label: "LoRa peer-to-peer mesh broadcast",
          detail: "Sub-GHz LoRa packets propagate to WS-002 and WS-003 with zero internet",
          timeOffsetSec: 3.5,
          displayTime: "t + 3.5s",
        },
        {
          id: "r6",
          label: "Inclusive multi-lingual voice & contact dispatch",
          detail: "Village speaker broadcasts in Hindi/Kumaoni; direct WhatsApp/SMS relay sent",
          timeOffsetSec: 4.2,
          displayTime: "t + 4.2s",
        },
      ];
    case "landslide":
      return [
        {
          id: "r1",
          label: "Seismic micro-tremors detected",
          detail: "Geophone accelerometer records high-frequency acoustic shear waves",
          timeOffsetSec: 0.3,
          displayTime: "t + 0.3s",
        },
        {
          id: "r2",
          label: "Soil moisture saturation critical",
          detail: "Deep probe records 94% saturation (critical threshold >90%)",
          timeOffsetSec: 0.8,
          displayTime: "t + 0.8s",
        },
        {
          id: "r3",
          label: "Slope displacement confirmed",
          detail: "mmWave radar detects >8 cm slope slip; confidence 88%",
          timeOffsetSec: 2.0,
          displayTime: "t + 2.0s",
        },
        {
          id: "r4",
          label: "Local siren horn & LED strobe active",
          detail: "Immediate roadside warning beacons activate for mountain vehicles",
          timeOffsetSec: 2.1,
          displayTime: "t + 2.1s",
        },
        {
          id: "r5",
          label: "LoRa peer-to-peer mesh broadcast",
          detail: "Alert relayed across mountain ridge hops without cell towers",
          timeOffsetSec: 3.0,
          displayTime: "t + 3.0s",
        },
        {
          id: "r6",
          label: "Direct village evacuation alerts",
          detail: "Sarpanch, school, and health post receive immediate automated alerts",
          timeOffsetSec: 3.8,
          displayTime: "t + 3.8s",
        },
      ];
    case "flash_flood":
      return [
        {
          id: "r1",
          label: "Water level rate-of-rise anomaly",
          detail: "Radar gauge records +6 cm/min rise rate (threshold >5 cm/min)",
          timeOffsetSec: 0.4,
          displayTime: "t + 0.4s",
        },
        {
          id: "r2",
          label: "Turbidity spike detected",
          detail: "Optical sensor reads 142 NTU showing high sediment runoff surge",
          timeOffsetSec: 0.9,
          displayTime: "t + 0.9s",
        },
        {
          id: "r3",
          label: "Upstream rate-of-rise trend confirmed",
          detail: "Qualcomm Edge AI trend model confirms flash flood with 91% confidence",
          timeOffsetSec: 2.0,
          displayTime: "t + 2.0s",
        },
        {
          id: "r4",
          label: "Local riverside sirens & beacons active",
          detail: "Audio evacuation warning sounds at riverbanks and ghats",
          timeOffsetSec: 2.1,
          displayTime: "t + 2.1s",
        },
        {
          id: "r5",
          label: "LoRa peer-to-peer mesh broadcast",
          detail: "Downstream river nodes HS-002/HS-003 receive advance flood warning",
          timeOffsetSec: 3.0,
          displayTime: "t + 3.0s",
        },
        {
          id: "r6",
          label: "Downstream lead time delivered",
          detail: "Low-lying settlements receive warning 25+ minutes before water surge arrives",
          timeOffsetSec: 3.9,
          displayTime: "t + 3.9s",
        },
      ];
  }
}

function getLegacySteps(scenario: ScenarioId, isOffline: boolean): Omit<TimelineStep, "status">[] {
  switch (scenario) {
    case "forest_fire":
      return [
        {
          id: "l1",
          label: "Hazard ignition at forest canopy",
          detail: "Ground fire starts; no local automated acoustic/thermal edge sensors",
          timeOffsetSec: 0,
          displayTime: "t + 0 min",
        },
        {
          id: "l2",
          label: "Next scheduled satellite orbit pass",
          detail: "Waiting for polar orbit satellite pass (MODIS / VIIRS thermal sensor)",
          timeOffsetSec: 45 * 60,
          displayTime: "t + 45 min",
        },
        {
          id: "l3",
          label: "Satellite raw data downlink & ingest",
          detail: "Downlink to ground station and transfer to central agency server",
          timeOffsetSec: 75 * 60,
          displayTime: "t + 75 min",
        },
        {
          id: "l4",
          label: "Centralized cloud batch processing",
          detail: isOffline
            ? "Cloud pipeline unreachable due to regional power grid failure"
            : "Cloud servers run hotspot extraction and cloud-mask filtering",
          timeOffsetSec: 110 * 60,
          displayTime: "t + 110 min",
        },
        {
          id: "l5",
          label: "State disaster agency manual verification",
          detail: isOffline
            ? "Agency cannot communicate with unpowered local monitoring stations"
            : "Human officer reviews fire coordinates and prepares bulletin draft",
          timeOffsetSec: 150 * 60,
          displayTime: "t + 150 min",
        },
        {
          id: "l6",
          label: "Cellular SMS & media bulletin broadcast",
          detail: isOffline
            ? "FAILED: Cellular base stations unpowered; tower backhaul severed"
            : "SMS gateway sends mass SMS (frequently delayed or missed by offline villagers)",
          timeOffsetSec: 180 * 60,
          displayTime: "t + 180 min",
        },
      ];
    case "landslide":
      return [
        {
          id: "l1",
          label: "Slope displacement initiated",
          detail: "Slope movement starts; no autonomous acoustic or mmWave sensors",
          timeOffsetSec: 0,
          displayTime: "t + 0 min",
        },
        {
          id: "l2",
          label: "Local witness phone report",
          detail: "Passerby attempts to call emergency number if cell signal is available",
          timeOffsetSec: 30 * 60,
          displayTime: "t + 30 min",
        },
        {
          id: "l3",
          label: "District control room verification",
          detail: "Control room logs ticket and attempts to contact local police chowki",
          timeOffsetSec: 60 * 60,
          displayTime: "t + 60 min",
        },
        {
          id: "l4",
          label: "Physical inspection dispatch",
          detail: isOffline
            ? "Dispatch delayed; communications and power lines disrupted"
            : "Patrol team dispatched to inspect road blockage",
          timeOffsetSec: 95 * 60,
          displayTime: "t + 95 min",
        },
        {
          id: "l5",
          label: "Manual highway closure authorization",
          detail: isOffline
            ? "Officers unable to transmit closure order without network"
            : "Administration drafts emergency traffic advisory",
          timeOffsetSec: 135 * 60,
          displayTime: "t + 135 min",
        },
        {
          id: "l6",
          label: "Broadcast advisory broadcast",
          detail: isOffline
            ? "FAILED: Power blackout prevents radio/cellular dissemination"
            : "Advisory published on web portal and emergency radio",
          timeOffsetSec: 165 * 60,
          displayTime: "t + 165 min",
        },
      ];
    case "flash_flood":
      return [
        {
          id: "l1",
          label: "Heavy upstream cloudburst runoff",
          detail: "Water rises rapidly in remote catchment basin",
          timeOffsetSec: 0,
          displayTime: "t + 0 min",
        },
        {
          id: "l2",
          label: "Manual river gauge reading",
          detail: "Scheduled gauge reader observes level twice daily (08:00 & 16:00)",
          timeOffsetSec: 40 * 60,
          displayTime: "t + 40 min",
        },
        {
          id: "l3",
          label: "Phone telemetry relay to division office",
          detail: "Observer telephones water resources division office",
          timeOffsetSec: 70 * 60,
          displayTime: "t + 70 min",
        },
        {
          id: "l4",
          label: "Central hydrological model run",
          detail: isOffline
            ? "Central server telemetry ingest stalled by power cut"
            : "Batch run on regional hydrological simulation model",
          timeOffsetSec: 105 * 60,
          displayTime: "t + 105 min",
        },
        {
          id: "l5",
          label: "Disaster management committee sign-off",
          detail: isOffline
            ? "Inter-departmental coordination halted by blackout"
            : "Official flood warning bulletin drafted and signed",
          timeOffsetSec: 145 * 60,
          displayTime: "t + 145 min",
        },
        {
          id: "l6",
          label: "Loudspeaker vehicle / SMS broadcast",
          detail: isOffline
            ? "FAILED: Cellular network down and roads blocked by early water surge"
            : "Vehicles deployed with manual megaphones; flood already hitting villages",
          timeOffsetSec: 175 * 60,
          displayTime: "t + 175 min",
        },
      ];
  }
}

export default function ComparePage() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("forest_fire");
  const [offlineMode, setOfflineMode] = useState(true);
  const [simRunning, setSimRunning] = useState(false);
  const [elapsedSimSec, setElapsedSimSec] = useState(0);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(2);

  const startWallRef = useRef<number>(0);
  const accumulatedSecRef = useRef<number>(0);

  const resiliNetRaw = getResiliNetSteps(scenarioId);
  const legacyRaw = getLegacySteps(scenarioId, offlineMode);

  // Derive status of each step based on elapsedSimSec
  // ResiliNet completes in ~4.5 seconds real-time representation (scaled 1:1 with sim time)
  // Legacy timeline is mapped over the same 4.5 seconds run to show synchronous progression
  const maxResiliTime = resiliNetRaw[resiliNetRaw.length - 1].timeOffsetSec;

  const resiliNetSteps: TimelineStep[] = resiliNetRaw.map((step) => {
    let status: TimelineStep["status"] = "idle";
    if (elapsedSimSec >= step.timeOffsetSec) {
      status = "complete";
    } else if (elapsedSimSec > 0 && elapsedSimSec >= step.timeOffsetSec - 0.5) {
      status = "in_progress";
    }
    return { ...step, status };
  });

  const legacySteps: TimelineStep[] = legacyRaw.map((step, idx) => {
    // Map the 0..180 min legacy timeline to elapsedSimSec across the 0..4.5s simulation
    const mappedSec = (idx / (legacyRaw.length - 1)) * maxResiliTime;
    let status: TimelineStep["status"] = "idle";

    if (offlineMode && idx >= 3) {
      // If offline mode is active, steps from step 4 onwards fail
      if (elapsedSimSec >= mappedSec) {
        status = "failed";
      } else if (elapsedSimSec > mappedSec - 0.5) {
        status = "in_progress";
      }
    } else {
      if (elapsedSimSec >= mappedSec) {
        status = "complete";
      } else if (elapsedSimSec > mappedSec - 0.5) {
        status = "in_progress";
      }
    }
    return { ...step, status };
  });

  const isResiliComplete = elapsedSimSec >= maxResiliTime;
  const isLegacyFinished = elapsedSimSec >= maxResiliTime;

  // Latency counters
  const resiliLatencyText =
    elapsedSimSec === 0
      ? "0.0s"
      : isResiliComplete
      ? `${maxResiliTime.toFixed(1)}s`
      : `${elapsedSimSec.toFixed(1)}s`;

  const legacySimMinutes = Math.min(
    Math.round((elapsedSimSec / maxResiliTime) * 180),
    180
  );
  const legacyLatencyText =
    elapsedSimSec === 0
      ? "0 min"
      : offlineMode && elapsedSimSec >= (3 / 5) * maxResiliTime
      ? "FAILED (NO DATA)"
      : `${legacySimMinutes} min (${(legacySimMinutes / 60).toFixed(1)}h)`;

  // Sim ticker
  useEffect(() => {
    if (!simRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaSec = ((now - startWallRef.current) / 1000) * simSpeed;
      const current = accumulatedSecRef.current + deltaSec;

      if (current >= maxResiliTime + 0.5) {
        setElapsedSimSec(maxResiliTime);
        setSimRunning(false);
      } else {
        setElapsedSimSec(current);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [simRunning, simSpeed, maxResiliTime]);

  const handleStart = () => {
    if (elapsedSimSec >= maxResiliTime) {
      accumulatedSecRef.current = 0;
      setElapsedSimSec(0);
    } else {
      accumulatedSecRef.current = elapsedSimSec;
    }
    startWallRef.current = Date.now();
    setSimRunning(true);
  };

  const handlePause = () => {
    accumulatedSecRef.current = elapsedSimSec;
    setSimRunning(false);
  };

  const handleReset = () => {
    setSimRunning(false);
    accumulatedSecRef.current = 0;
    setElapsedSimSec(0);
  };

  const activeScenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-medium text-text">Old System vs ResiliNet-AI</h1>
          <Badge status="info" label="SYNCHRONIZED BENCHMARK" size="sm" />
        </div>
        <p className="text-sm text-muted">
          Compare the standard satellite and cloud telemetry workflow against ResiliNet-AI’s
          autonomous solar LoRa edge mesh during catastrophic hazard events.
        </p>
      </div>

      {/* Control Bar */}
      <Panel className="p-0">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 border-b border-line bg-surface-2">
          {/* Scenario selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-faint uppercase font-mono tracking-wide mr-1">Scenario:</span>
            {SCENARIOS.map((s) => (
              <Button
                key={s.id}
                variant={scenarioId === s.id ? "default" : "ghost"}
                size="sm"
                icon={s.icon}
                onClick={() => {
                  setScenarioId(s.id);
                  handleReset();
                }}
              >
                {s.name}
              </Button>
            ))}
          </div>

          {/* Grid & Tower Down Stress Toggle */}
          <div className="flex items-center gap-3 bg-surface px-3 py-1.5 rounded-md border border-line">
            <div className="flex items-center gap-1.5">
              <ZapOff size={13} strokeWidth={1.5} className={offlineMode ? "text-critical" : "text-faint"} />
              <RadioTower size={13} strokeWidth={1.5} className={offlineMode ? "text-critical" : "text-faint"} />
            </div>
            <Toggle
              checked={offlineMode}
              onChange={(v) => {
                setOfflineMode(v);
                handleReset();
              }}
              label="Grid down + Tower down"
            />
          </div>
        </div>

        {/* Playback Controls & KPI row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-2">
            <Button
              variant={simRunning ? "ghost" : "default"}
              size="sm"
              icon={simRunning ? <Pause size={13} strokeWidth={1.5} /> : <Play size={13} strokeWidth={1.5} />}
              onClick={simRunning ? handlePause : handleStart}
            >
              {simRunning ? "Pause" : elapsedSimSec > 0 && !isResiliComplete ? "Resume" : "Run Comparison"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<RotateCcw size={13} strokeWidth={1.5} />}
              onClick={handleReset}
            >
              Reset
            </Button>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-xs text-faint font-mono">Speed:</span>
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimSpeed(speed as 1 | 2 | 5)}
                  className={[
                    "w-6 h-6 rounded-sm text-xs font-mono transition-colors duration-fast border",
                    simSpeed === speed
                      ? "bg-accent text-bg border-accent"
                      : "text-muted border-line hover:text-text hover:bg-surface-2",
                  ].join(" ")}
                >
                  {speed}×
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted font-mono flex items-center gap-1.5">
            <Clock size={12} strokeWidth={1.5} className="text-faint" />
            <span>Target: {activeScenario.description}</span>
          </div>
        </div>
      </Panel>

      {/* Latency Comparison Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-line bg-surface flex flex-col justify-between">
          <Stat
            label="ResiliNet-AI Time-to-Alert"
            value={resiliLatencyText}
            icon={<ShieldCheck size={13} strokeWidth={1.5} className="text-ok" />}
            valueClassName="text-ok text-xl font-semibold"
            sublabel="Autonomous on-device edge AI + solar LoRa mesh"
          />
        </div>

        <div className="p-4 rounded-lg border border-line bg-surface flex flex-col justify-between">
          <Stat
            label="Legacy Satellite/Cloud Latency"
            value={legacyLatencyText}
            icon={<AlertTriangle size={13} strokeWidth={1.5} className={offlineMode ? "text-critical" : "text-warn"} />}
            valueClassName={offlineMode && elapsedSimSec >= 2.5 ? "text-critical text-lg font-semibold" : "text-warn text-xl font-semibold"}
            sublabel={offlineMode ? "Blocked when cell towers and grid power fail" : "Orbit pass + batch ingest + manual review"}
          />
        </div>

        <div className="p-4 rounded-lg border border-line bg-surface flex flex-col justify-between">
          <Stat
            label="Alert Lead-Time Gain"
            value="3,000× faster"
            icon={<Clock size={13} strokeWidth={1.5} className="text-accent" />}
            valueClassName="text-accent text-xl font-semibold"
            sublabel="Seconds vs hours — critical window for evacuation"
          />
        </div>
      </div>

      {/* Side-by-side Synchronized Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ResiliNet-AI Timeline */}
        <div className="rounded-lg border border-line bg-surface overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ok" />
              <h2 className="text-sm font-medium text-text">ResiliNet-AI Pipeline</h2>
            </div>
            <Badge
              status={isResiliComplete ? "ok" : elapsedSimSec > 0 ? "warn" : "muted"}
              label={isResiliComplete ? "ALERT BROADCAST DELIVERED" : elapsedSimSec > 0 ? "IN PROGRESS" : "READY"}
              size="sm"
            />
          </div>

          <div className="p-4 space-y-4 flex-1">
            <ol className="space-y-0">
              {resiliNetSteps.map((step, idx) => (
                <li key={step.id} className="flex gap-3 relative">
                  {idx < resiliNetSteps.length - 1 && (
                    <div
                      className={`absolute left-3 top-5 bottom-0 w-px ${
                        step.status === "complete" ? "bg-ok/60" : "bg-line"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center z-10 transition-colors duration-fast ${
                      step.status === "complete"
                        ? "border-ok bg-ok/10 text-ok"
                        : step.status === "in_progress"
                        ? "border-warn bg-warn/10 text-warn animate-pulse"
                        : "border-line bg-surface-2 text-faint"
                    }`}
                  >
                    {step.status === "complete" ? (
                      <CheckCircle2 size={12} strokeWidth={2} />
                    ) : (
                      <span className="font-mono text-xs">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 pb-4 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className={`text-sm font-medium ${
                          step.status === "complete"
                            ? "text-text"
                            : step.status === "in_progress"
                            ? "text-accent"
                            : "text-muted"
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="font-mono text-xs text-faint">{step.displayTime}</span>
                    </div>
                    <p className="text-xs text-muted mt-0.5 leading-snug">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Offline Resilience Note */}
            <div className="p-3 rounded-md bg-surface-2 border border-line text-xs text-muted space-y-1">
              <p className="text-text font-medium flex items-center gap-1.5">
                <ShieldCheck size={12} strokeWidth={1.5} className="text-ok" />
                Zero Grid & Cell Dependence
              </p>
              <p className="text-faint">
                LiFePO4 battery charged by on-node solar panel powers on-device Qualcomm AI inference
                and peer-to-peer LoRa mesh transmission. Sirens, strobes, and local speaker broadcasts trigger instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Legacy System Timeline */}
        <div className="rounded-lg border border-line bg-surface overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${offlineMode && elapsedSimSec >= 2.5 ? "bg-critical" : "bg-warn"}`} />
              <h2 className="text-sm font-medium text-text">Legacy System Pipeline</h2>
            </div>
            <Badge
              status={
                offlineMode && elapsedSimSec >= 2.5
                  ? "critical"
                  : isLegacyFinished
                  ? "warn"
                  : elapsedSimSec > 0
                  ? "warn"
                  : "muted"
              }
              label={
                offlineMode && elapsedSimSec >= 2.5
                  ? "CATASTROPHIC FAILURE"
                  : isLegacyFinished
                  ? "COMPLETED AFTER ~3 HOURS"
                  : elapsedSimSec > 0
                  ? "IN PROGRESS (~45-180m)"
                  : "STANDBY"
              }
              size="sm"
            />
          </div>

          <div className="p-4 space-y-4 flex-1">
            <ol className="space-y-0">
              {legacySteps.map((step, idx) => (
                <li key={step.id} className="flex gap-3 relative">
                  {idx < legacySteps.length - 1 && (
                    <div
                      className={`absolute left-3 top-5 bottom-0 w-px ${
                        step.status === "failed"
                          ? "bg-critical/60"
                          : step.status === "complete"
                          ? "bg-warn/60"
                          : "bg-line"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center z-10 transition-colors duration-fast ${
                      step.status === "failed"
                        ? "border-critical bg-critical/10 text-critical"
                        : step.status === "complete"
                        ? "border-warn bg-warn/10 text-warn"
                        : step.status === "in_progress"
                        ? "border-warn bg-warn/10 text-warn animate-pulse"
                        : "border-line bg-surface-2 text-faint"
                    }`}
                  >
                    {step.status === "failed" ? (
                      <XCircle size={12} strokeWidth={2} />
                    ) : (
                      <span className="font-mono text-xs">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 pb-4 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className={`text-sm font-medium ${
                          step.status === "failed"
                            ? "text-critical"
                            : step.status === "complete"
                            ? "text-text"
                            : "text-muted"
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="font-mono text-xs text-faint">{step.displayTime}</span>
                    </div>
                    <p
                      className={`text-xs mt-0.5 leading-snug ${
                        step.status === "failed" ? "text-critical/90" : "text-muted"
                      }`}
                    >
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Offline Failure Note */}
            <div
              className={`p-3 rounded-md border text-xs space-y-1 ${
                offlineMode
                  ? "bg-critical/10 border-critical/30 text-critical"
                  : "bg-surface-2 border-line text-muted"
              }`}
            >
              <p className="font-medium flex items-center gap-1.5">
                <AlertTriangle size={12} strokeWidth={1.5} />
                {offlineMode ? "Vulnerable Single Points of Failure" : "Heavy Centralized Overhead"}
              </p>
              <p className={offlineMode ? "text-critical/80" : "text-faint"}>
                {offlineMode
                  ? "During severe storms, floods, or mountain landslides, grid power blackouts and cell tower backhaul cuts cause total blackout in centralized pipelines."
                  : "Requires uninterrupted satellite downlinks, cloud connectivity, manual officer verification, and functioning mobile carrier gateways."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
