"use client";

/**
 * app/hardware-lab/page.tsx
 * ResiliNet-AI Hardware Lab & Edge Sensor Demonstration.
 *
 * Redesigned with progressive disclosure:
 *  - Primary View: Intuitive, 5-second human-friendly overview of node status,
 *    active hazards, 3 hazard categories (Fire, Landslide, Flood), and 5-step detection flow.
 *  - Technical Diagnostics (Collapsible): Complete low-level engineering console for judges
 *    (GPIO pin mapping, ADC readings, LoRa RSSI, manual override sliders, and UART serial monitor).
 */

import { useState, useEffect, useMemo } from "react";
import {
  Flame,
  MountainSnow,
  Droplets,
  RotateCcw,
  Cpu,
  Radio,
  Sun,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Terminal,
  Volume2,
  VolumeX,
  MapPin,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import Stat from "@/components/ui/Stat";
import {
  HardwareTelemetry,
  HardwareEvent,
  NODE_CONFIG,
  BASELINE_TELEMETRY,
  FIRE_TELEMETRY,
  LANDSLIDE_TELEMETRY,
  FLOOD_TELEMETRY,
  evaluateHardwareTelemetry,
  getBoardPinStates,
} from "@/lib/hardwareBridge";

interface SerialLogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "CRIT" | "MESH";
  message: string;
}

export default function HardwareLabPage() {
  const [telemetry, setTelemetry] = useState<HardwareTelemetry>(BASELINE_TELEMETRY);
  const [activeScenario, setActiveScenario] = useState<"none" | "forest_fire" | "landslide" | "flash_flood">("none");
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  const [serialLogs, setSerialLogs] = useState<SerialLogEntry[]>([]);
  const [clock, setClock] = useState<string>("00:00:00");

  // Keep a local ticking clock for logs & timestamps
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setClock(`${hh}:${mm}:${ss}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute evaluated event state from telemetry
  const event: HardwareEvent = useMemo(() => {
    return evaluateHardwareTelemetry(telemetry);
  }, [telemetry]);

  const pinStates = useMemo(() => {
    return getBoardPinStates(event);
  }, [event]);

  // Append serial monitor logs on hazard / telemetry state changes
  useEffect(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const timeStr = `${hh}:${mm}:${ss}`;
    const newLogs: SerialLogEntry[] = [];

    if (event.hazard === "forest_fire") {
      newLogs.push(
        {
          id: `${Date.now()}-1`,
          timestamp: timeStr,
          level: "WARN",
          message: `[DHT22] Reading temp=${telemetry.temperature.toFixed(1)}°C, hum=${telemetry.humidity.toFixed(0)}% -> THRESHOLD EXCEEDED (>55°C)`,
        },
        {
          id: `${Date.now()}-2`,
          timestamp: timeStr,
          level: "CRIT",
          message: "[EDGE_AI] Anomaly Classifier: Forest Fire pattern CONFIRMED (Confidence: 96%)",
        },
        {
          id: `${Date.now()}-3`,
          timestamp: timeStr,
          level: "WARN",
          message: "[GPIO_ACT] GPIO2 (Red LED) -> HIGH | GPIO23 (Buzzer) -> PWM 2.7kHz 85dB",
        },
        {
          id: `${Date.now()}-4`,
          timestamp: timeStr,
          level: "MESH",
          message: "[SX1262] Packet broadcasted: TYPE=HAZARD_FIRE, ORIGIN=WS-001, RSSI=-72dBm",
        }
      );
    } else if (event.hazard === "landslide") {
      newLogs.push(
        {
          id: `${Date.now()}-1`,
          timestamp: timeStr,
          level: "WARN",
          message: `[SW-420] Accelerometer peak=${telemetry.vibration.toFixed(2)}g -> HIGH-G ACCEL TRIP (>3.0g)`,
        },
        {
          id: `${Date.now()}-2`,
          timestamp: timeStr,
          level: "CRIT",
          message: "[EDGE_AI] Kinematic Classifier: Rapid slope displacement CONFIRMED (Confidence: 94%)",
        },
        {
          id: `${Date.now()}-3`,
          timestamp: timeStr,
          level: "WARN",
          message: "[GPIO_ACT] GPIO2 (Red LED) -> HIGH | GPIO23 (Buzzer) -> PWM 2.7kHz 85dB",
        },
        {
          id: `${Date.now()}-4`,
          timestamp: timeStr,
          level: "MESH",
          message: "[SX1262] Packet broadcasted: TYPE=HAZARD_LANDSLIDE, ORIGIN=WS-001, RSSI=-68dBm",
        }
      );
    } else if (event.hazard === "flash_flood") {
      newLogs.push(
        {
          id: `${Date.now()}-1`,
          timestamp: timeStr,
          level: "WARN",
          message: `[HC-SR04] Echo clearance=${telemetry.distance.toFixed(1)}cm -> CRITICAL CREST (<30cm)`,
        },
        {
          id: `${Date.now()}-2`,
          timestamp: timeStr,
          level: "CRIT",
          message: "[EDGE_AI] Hydro Classifier: Flash flood water surge CONFIRMED (Confidence: 98%)",
        },
        {
          id: `${Date.now()}-3`,
          timestamp: timeStr,
          level: "WARN",
          message: "[GPIO_ACT] GPIO2 (Red LED) -> HIGH | GPIO23 (Buzzer) -> PWM 2.7kHz 85dB",
        },
        {
          id: `${Date.now()}-4`,
          timestamp: timeStr,
          level: "MESH",
          message: "[SX1262] Packet broadcasted: TYPE=HAZARD_FLOOD, ORIGIN=WS-001, RSSI=-74dBm",
        }
      );
    } else {
      newLogs.push({
        id: `${Date.now()}-0`,
        timestamp: timeStr,
        level: "INFO",
        message: `[SYS] Nominal loop: Temp=${telemetry.temperature.toFixed(1)}°C, Dist=${telemetry.distance.toFixed(0)}cm, Vib=${telemetry.vibration.toFixed(2)}g -> SAFE`,
      });
    }

    setSerialLogs((prev) => [...newLogs, ...prev].slice(0, 40));
  }, [event.hazard, telemetry]);

  // Demo trigger handlers
  const handleTriggerFire = () => {
    setActiveScenario("forest_fire");
    setTelemetry(FIRE_TELEMETRY);
  };

  const handleTriggerLandslide = () => {
    setActiveScenario("landslide");
    setTelemetry(LANDSLIDE_TELEMETRY);
  };

  const handleTriggerFlood = () => {
    setActiveScenario("flash_flood");
    setTelemetry(FLOOD_TELEMETRY);
  };

  const handleReset = () => {
    setActiveScenario("none");
    setTelemetry(BASELINE_TELEMETRY);
  };

  const isHazardActive = event.hazard !== "none";

  return (
    <div className="flex-1 overflow-y-auto bg-bg text-text p-4 md:p-6 space-y-6">
      {/* Top Header & Interactive Demo Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-1 border-b border-line">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-medium tracking-tight text-text">
              Hardware Lab & Sensor Network
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-muted bg-surface-2 border border-line rounded-sm px-2 py-0.5">
              <MapPin size={11} strokeWidth={1.5} className="text-accent" />
              {NODE_CONFIG.nodeId} · {NODE_CONFIG.nodeName} ({NODE_CONFIG.region})
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Simulated edge disaster detection node with real-time on-site sirens and LoRa mesh communication.
          </p>
        </div>

        {/* Demo Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={activeScenario === "forest_fire" ? "danger" : "ghost"}
            size="sm"
            onClick={handleTriggerFire}
            className="flex items-center gap-1.5 font-mono text-xs"
          >
            <Flame size={13} strokeWidth={1.5} className="text-warn" />
            <span>Trigger Fire</span>
          </Button>

          <Button
            variant={activeScenario === "landslide" ? "default" : "ghost"}
            size="sm"
            onClick={handleTriggerLandslide}
            className="flex items-center gap-1.5 font-mono text-xs"
          >
            <MountainSnow size={13} strokeWidth={1.5} className="text-accent" />
            <span>Trigger Landslide</span>
          </Button>

          <Button
            variant={activeScenario === "flash_flood" ? "default" : "ghost"}
            size="sm"
            onClick={handleTriggerFlood}
            className="flex items-center gap-1.5 font-mono text-xs"
          >
            <Droplets size={13} strokeWidth={1.5} className="text-info" />
            <span>Trigger Flood</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1.5 font-mono text-xs text-muted hover:text-text"
          >
            <RotateCcw size={13} strokeWidth={1.5} />
            <span>Reset (Safe)</span>
          </Button>
        </div>
      </div>

      {/* Primary Hero Status Banner (Calm vs Prominent Hazard) */}
      {!isHazardActive ? (
        <div className="p-4 sm:p-5 rounded-lg border border-ok/30 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-fast">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-ok/10 border border-ok/30 flex items-center justify-center text-ok flex-shrink-0">
              <ShieldCheck size={22} strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-wide text-ok">
                  SYSTEM OPERATIONAL
                </h2>
                <Badge status="ok" label="NOMINAL" />
              </div>
              <p className="text-xs text-text mt-0.5">
                No active threats · All 3 environmental safety channels normal
              </p>
              <p className="text-xs text-muted mt-0.5">
                Monitoring 24/7 on solar backup · Local alarm & mesh radio on standby
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 text-xs font-mono text-muted bg-surface-2 border border-line rounded-md px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-ok" />
              <span>Alarm: Standby</span>
            </div>
            <div className="hidden sm:block text-faint">|</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Radio: Listening</span>
            </div>
            <div className="hidden sm:block text-faint">|</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-ok" />
              <span>Battery: 92%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-lg border-2 border-critical/80 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-fast animate-pulse">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-md bg-critical/20 border border-critical flex items-center justify-center text-critical flex-shrink-0">
              <AlertTriangle size={22} strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-wide text-critical uppercase">
                  {event.hazard === "forest_fire"
                    ? "FOREST FIRE DETECTED"
                    : event.hazard === "landslide"
                    ? "LANDSLIDE DETECTED"
                    : "FLASH FLOOD DETECTED"}
                </h2>
                <Badge status="critical" label="CRITICAL ALERT" />
              </div>
              <p className="text-xs font-medium text-text mt-0.5">
                Location: {NODE_CONFIG.nodeName} ({NODE_CONFIG.region})
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1 text-xs font-mono text-critical bg-critical/10 border border-critical/30 rounded-xs px-2 py-0.5">
                  <Bell size={11} strokeWidth={1.5} />
                  Local Alarm Active (85dB Siren + Strobe)
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-accent bg-accent/10 border border-accent/30 rounded-xs px-2 py-0.5">
                  <Radio size={11} strokeWidth={1.5} />
                  LoRa Alert Transmitted
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-muted bg-surface-2 border border-line rounded-xs px-2 py-0.5">
                  Response Time: &lt; 45ms
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-1.5 font-mono text-xs border border-line bg-surface-2 hover:bg-surface"
            >
              <RotateCcw size={13} strokeWidth={1.5} />
              <span>Dismiss & Reset</span>
            </Button>
          </div>
        </div>
      )}

      {/* 3 Hazard Sensor Categories Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase text-muted tracking-wider">
            Environmental Hazard Channels
          </h2>
          <span className="text-xs text-faint font-mono">
            On-device multi-sensor sampling
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Forest Fire */}
          <div
            className={`p-4 rounded-lg border transition-all duration-fast flex flex-col justify-between space-y-3 ${
              event.hazard === "forest_fire"
                ? "bg-surface border-warn/70 ring-1 ring-warn/30"
                : "bg-surface border-line opacity-95"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                    event.hazard === "forest_fire"
                      ? "bg-warn/20 text-warn border border-warn/40"
                      : "bg-surface-2 text-muted border border-line"
                  }`}
                >
                  <Flame size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text">Fire & Heat</h3>
                  <p className="text-xs text-faint">Thermal & humidity</p>
                </div>
              </div>
              <Badge
                status={event.hazard === "forest_fire" ? "critical" : "ok"}
                label={event.hazard === "forest_fire" ? "CRITICAL" : "NORMAL"}
              />
            </div>

            <div className="p-2.5 rounded-md bg-surface-2 border border-line space-y-1 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Temperature:</span>
                <span
                  className={
                    telemetry.temperature > 50
                      ? "text-critical font-bold"
                      : "text-text"
                  }
                >
                  {telemetry.temperature.toFixed(1)}°C
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Air Humidity:</span>
                <span
                  className={
                    telemetry.humidity < 20
                      ? "text-warn font-semibold"
                      : "text-text"
                  }
                >
                  {telemetry.humidity.toFixed(0)}% RH
                </span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {event.hazard === "forest_fire"
                ? "Thermal anomaly detected above safety envelope (>55°C). Immediate on-site alarm firing."
                : "Canopy temperatures and humidity levels are within safe operating ranges."}
            </p>
          </div>

          {/* Card 2: Landslide */}
          <div
            className={`p-4 rounded-lg border transition-all duration-fast flex flex-col justify-between space-y-3 ${
              event.hazard === "landslide"
                ? "bg-surface border-accent/70 ring-1 ring-accent/30"
                : "bg-surface border-line opacity-95"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                    event.hazard === "landslide"
                      ? "bg-accent/20 text-accent border border-accent/40"
                      : "bg-surface-2 text-muted border border-line"
                  }`}
                >
                  <MountainSnow size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text">Landslide</h3>
                  <p className="text-xs text-faint">Slope tremor & tilt</p>
                </div>
              </div>
              <Badge
                status={event.hazard === "landslide" ? "critical" : "ok"}
                label={event.hazard === "landslide" ? "CRITICAL" : "STABLE"}
              />
            </div>

            <div className="p-2.5 rounded-md bg-surface-2 border border-line space-y-1 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Ground Motion:</span>
                <span
                  className={
                    telemetry.vibration > 3.0
                      ? "text-critical font-bold"
                      : "text-text"
                  }
                >
                  {telemetry.vibration.toFixed(2)} g
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Slope Condition:</span>
                <span
                  className={
                    telemetry.vibration > 3.0
                      ? "text-critical font-semibold"
                      : "text-ok"
                  }
                >
                  {telemetry.vibration > 3.0 ? "Rapid Slip" : "Stable Bedrock"}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {event.hazard === "landslide"
                ? "High-g seismic vibration trip (>3.0g). Immediate slope displacement warning triggered."
                : "Hillside foundation tremor levels are quiet and nominal."}
            </p>
          </div>

          {/* Card 3: Flood */}
          <div
            className={`p-4 rounded-lg border transition-all duration-fast flex flex-col justify-between space-y-3 ${
              event.hazard === "flash_flood"
                ? "bg-surface border-info/70 ring-1 ring-info/30"
                : "bg-surface border-line opacity-95"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                    event.hazard === "flash_flood"
                      ? "bg-info/20 text-info border border-info/40"
                      : "bg-surface-2 text-muted border border-line"
                  }`}
                >
                  <Droplets size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text">Flash Flood</h3>
                  <p className="text-xs text-faint">Water level clearance</p>
                </div>
              </div>
              <Badge
                status={event.hazard === "flash_flood" ? "critical" : "ok"}
                label={event.hazard === "flash_flood" ? "CRITICAL" : "SAFE"}
              />
            </div>

            <div className="p-2.5 rounded-md bg-surface-2 border border-line space-y-1 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Water Clearance:</span>
                <span
                  className={
                    telemetry.distance < 30
                      ? "text-critical font-bold"
                      : "text-text"
                  }
                >
                  {telemetry.distance.toFixed(0)} cm
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Drainage Margin:</span>
                <span
                  className={
                    telemetry.distance < 30
                      ? "text-critical font-semibold"
                      : "text-ok"
                  }
                >
                  {telemetry.distance < 30 ? "Crest Breach" : "Adequate Margin"}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {event.hazard === "flash_flood"
                ? "Water level has risen below emergency clearance threshold (<30cm). Flood warning dispatched."
                : "Waterway clearance depth is well within safe seasonal parameters."}
            </p>
          </div>
        </div>
      </div>

      {/* Clear 5-Step Detection & Alert Flow */}
      <div className="bg-surface border border-line rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <div className="flex items-center gap-2">
            <Activity size={15} strokeWidth={1.5} className="text-accent" />
            <h2 className="text-xs font-mono font-medium text-text uppercase">
              End-to-End Disaster Alert Flow
            </h2>
          </div>
          <span className="text-xs font-mono text-muted">
            Total Pipeline Speed: &lt; 45ms Local / ~1.2s LoRa Relay
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
          {/* Step 1: Sensor */}
          <div
            className={`p-3 rounded-md border text-xs font-mono transition-colors duration-fast ${
              isHazardActive
                ? "bg-surface-2 border-warn/50 text-text"
                : "bg-surface border-line text-muted"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-faint font-semibold">1. SENSOR</span>
              {isHazardActive ? (
                <AlertTriangle size={12} strokeWidth={1.5} className="text-warn" />
              ) : (
                <CheckCircle2 size={12} strokeWidth={1.5} className="text-ok" />
              )}
            </div>
            <p className="font-medium text-text">
              {event.hazard === "forest_fire"
                ? "Temperature Anomaly Detected"
                : event.hazard === "landslide"
                ? "Ground Tremor Detected"
                : event.hazard === "flash_flood"
                ? "Water Level Spike"
                : "Continuous Sampling"}
            </p>
            <p className="text-faint mt-1">10 Readings/sec</p>
          </div>

          {/* Step 2: Edge Decision */}
          <div
            className={`p-3 rounded-md border text-xs font-mono transition-colors duration-fast ${
              isHazardActive
                ? "bg-surface-2 border-critical/50 text-text"
                : "bg-surface border-line text-muted"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-faint font-semibold">2. EDGE DECISION</span>
              <Cpu
                size={12}
                strokeWidth={1.5}
                className={isHazardActive ? "text-critical" : "text-faint"}
              />
            </div>
            <p className="font-medium text-text">
              {isHazardActive ? "On-Device Anomaly Detection" : "Zero False-Positive"}
            </p>
            <p className="text-faint mt-1">&lt; 45ms On-Device</p>
          </div>

          {/* Step 3: Local Alert */}
          <div
            className={`p-3 rounded-md border text-xs font-mono transition-colors duration-fast ${
              event.localAlertFired
                ? "bg-surface-2 border-critical/50 text-text"
                : "bg-surface border-line text-muted"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-faint font-semibold">3. LOCAL ALERT</span>
              <Bell
                size={12}
                strokeWidth={1.5}
                className={
                  event.localAlertFired
                    ? "text-critical animate-pulse"
                    : "text-faint"
                }
              />
            </div>
            <p className="font-medium text-text">
              {event.localAlertFired ? "Siren & Strobe Activated" : "Actuators Standby"}
            </p>
            <p className="text-faint mt-1">Instant On-Site Warning</p>
          </div>

          {/* Step 4: LoRa Mesh */}
          <div
            className={`p-3 rounded-md border text-xs font-mono transition-colors duration-fast ${
              isHazardActive
                ? "bg-surface-2 border-accent/50 text-text"
                : "bg-surface border-line text-muted"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-faint font-semibold">4. LORA MESH</span>
              <Radio
                size={12}
                strokeWidth={1.5}
                className={isHazardActive ? "text-accent" : "text-faint"}
              />
            </div>
            <p className="font-medium text-text">
              {isHazardActive ? "Long-Range Broadcast" : "Mesh Ready (865MHz)"}
            </p>
            <p className="text-faint mt-1">Zero Cell/Grid Dependency</p>
          </div>

          {/* Step 5: Dashboard */}
          <div
            className={`p-3 rounded-md border text-xs font-mono transition-colors duration-fast ${
              isHazardActive
                ? "bg-surface-2 border-ok/50 text-text"
                : "bg-surface border-line text-muted"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-faint font-semibold">5. DASHBOARD</span>
              <ShieldCheck
                size={12}
                strokeWidth={1.5}
                className={isHazardActive ? "text-ok" : "text-faint"}
              />
            </div>
            <p className="font-medium text-text">
              {isHazardActive ? "Community Map & SMS Alert" : "Live Real-Time View"}
            </p>
            <p className="text-faint mt-1">Multi-Channel Relay</p>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure Section: Technical Diagnostics (For Hackathon Judges & Engineers) */}
      <div className="border border-line rounded-lg bg-surface overflow-hidden">
        <button
          type="button"
          onClick={() => setShowDiagnostics((prev) => !prev)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-surface-2 transition-colors duration-fast"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-surface-2 border border-line flex items-center justify-center text-accent">
              <Terminal size={14} strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text">
                  Technical Diagnostics & Engineering Console
                </span>
                <span className="text-xs font-mono text-muted border border-line rounded-sm px-1.5 py-0.5">
                  JUDGE INSPECTION
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                GPIO pinouts, ADC solar telemetry, manual threshold sliders, and UART serial monitor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-faint">
            <span>{showDiagnostics ? "Hide Diagnostics" : "Expand Diagnostics"}</span>
            {showDiagnostics ? (
              <ChevronUp size={16} strokeWidth={1.5} />
            ) : (
              <ChevronDown size={16} strokeWidth={1.5} />
            )}
          </div>
        </button>

        {showDiagnostics && (
          <div className="p-4 border-t border-line space-y-6 bg-bg">
            {/* Engineering Specs & System Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-surface rounded-md border border-line">
                <Stat
                  label="Microcontroller"
                  value="ESP32-WROOM"
                  icon={<Cpu size={13} strokeWidth={1.5} />}
                  sublabel="Dual-core 240MHz"
                />
              </div>

              <div className="p-3 bg-surface rounded-md border border-line">
                <Stat
                  label="Solar ADC Input"
                  value={`${telemetry.rawAdcSolar.toFixed(1)}V`}
                  icon={<Sun size={13} strokeWidth={1.5} />}
                  valueClassName="text-ok"
                  sublabel="MPPT CN3791"
                />
              </div>

              <div className="p-3 bg-surface rounded-md border border-line">
                <Stat
                  label="Battery Level"
                  value={`${telemetry.batteryPct}%`}
                  icon={<Zap size={13} strokeWidth={1.5} />}
                  valueClassName="text-ok"
                  sublabel="128Wh LiFePO4"
                />
              </div>

              <div className="p-3 bg-surface rounded-md border border-line">
                <Stat
                  label="LoRa RSSI / SNR"
                  value="-72 dBm"
                  icon={<Radio size={13} strokeWidth={1.5} />}
                  valueClassName="text-accent"
                  sublabel="SX1262 (+22dBm)"
                />
              </div>
            </div>

            {/* 2-Column Technical Layout: GPIO/Sliders on Left, Serial on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (5 cols): Pin Bus & Manual Overrides */}
              <div className="lg:col-span-5 space-y-4">
                {/* GPIO & Actuator States */}
                <Panel title="Virtual Microcontroller Pin Bus (GPIO / SPI / ADC)">
                  <div className="space-y-1.5">
                    {pinStates.map((pin) => (
                      <div
                        key={pin.label}
                        className={`flex items-center justify-between p-2 rounded-sm border text-xs font-mono transition-colors duration-fast ${
                          pin.active
                            ? "bg-surface-2 border-accent/40 text-text"
                            : "bg-surface border-line text-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`px-1.5 py-0.5 rounded-xs text-xs font-bold ${
                              pin.active
                                ? "bg-accent/20 text-accent"
                                : "bg-surface-2 text-faint border border-line"
                            }`}
                          >
                            {pin.pin}
                          </span>
                          <span className="truncate">{pin.label}</span>
                        </div>
                        <span
                          className={`font-mono text-xs flex-shrink-0 ${
                            pin.active ? "text-accent font-semibold" : "text-faint"
                          }`}
                        >
                          {pin.state}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-line">
                    <div
                      className={`p-2 rounded-md border flex items-center justify-between ${
                        event.ledActive
                          ? "bg-surface-2 border-critical text-critical"
                          : "bg-surface border-line text-muted"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            event.ledActive ? "bg-critical animate-ping" : "bg-line"
                          }`}
                        />
                        <span className="text-xs font-mono font-medium">RED LED (D2)</span>
                      </div>
                      <span className="text-xs font-mono">
                        {event.ledActive ? "HIGH" : "LOW"}
                      </span>
                    </div>

                    <div
                      className={`p-2 rounded-md border flex items-center justify-between ${
                        event.buzzerActive
                          ? "bg-surface-2 border-warn text-warn"
                          : "bg-surface border-line text-muted"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {event.buzzerActive ? (
                          <Volume2 size={13} strokeWidth={1.5} className="text-warn animate-bounce" />
                        ) : (
                          <VolumeX size={13} strokeWidth={1.5} className="text-faint" />
                        )}
                        <span className="text-xs font-mono font-medium">BUZZER (D23)</span>
                      </div>
                      <span className="text-xs font-mono">
                        {event.buzzerActive ? "PWM 85dB" : "OFF"}
                      </span>
                    </div>
                  </div>
                </Panel>

                {/* Manual Telemetry Override Sliders */}
                <Panel
                  title="Manual Sensor Calibration & Overrides"
                  actions={<SlidersHorizontal size={14} strokeWidth={1.5} className="text-faint" />}
                >
                  <div className="space-y-3.5">
                    {/* Temp slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted">DHT22 Temperature (Fire Trip &gt; 55°C)</span>
                        <span className="text-text font-medium">
                          {telemetry.temperature.toFixed(1)}°C
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        step="0.5"
                        value={telemetry.temperature}
                        onChange={(e) =>
                          setTelemetry((prev) => ({
                            ...prev,
                            temperature: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-accent"
                      />
                    </div>

                    {/* Ultrasonic slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted">HC-SR04 Clearance (Flood Trip &lt; 30cm)</span>
                        <span className="text-text font-medium">
                          {telemetry.distance.toFixed(0)} cm
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="250"
                        step="1"
                        value={telemetry.distance}
                        onChange={(e) =>
                          setTelemetry((prev) => ({
                            ...prev,
                            distance: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-accent"
                      />
                    </div>

                    {/* Vibration slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-muted">SW-420 Acceleration (Landslide Trip &gt; 3.0g)</span>
                        <span className="text-text font-medium">
                          {telemetry.vibration.toFixed(2)} g
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={telemetry.vibration}
                        onChange={(e) =>
                          setTelemetry((prev) => ({
                            ...prev,
                            vibration: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-accent"
                      />
                    </div>
                  </div>
                </Panel>
              </div>

              {/* Right Column (7 cols): Serial Monitor */}
              <div className="lg:col-span-7 space-y-4">
                <Panel
                  title="ESP32 On-Device Serial Monitor (UART0 115200 Baud)"
                  actions={
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
                      <span className="text-xs font-mono text-muted">ONLINE · RTC {clock}</span>
                    </div>
                  }
                >
                  <div className="bg-surface-2 border border-line rounded-md p-3 font-mono text-xs max-h-96 overflow-y-auto space-y-1">
                    {serialLogs.length === 0 ? (
                      <p className="text-faint italic">Waiting for serial stream output...</p>
                    ) : (
                      serialLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-faint flex-shrink-0">[{log.timestamp}]</span>
                          <span
                            className={`px-1 rounded-xs text-xs font-bold flex-shrink-0 ${
                              log.level === "CRIT"
                                ? "bg-critical/20 text-critical"
                                : log.level === "WARN"
                                ? "bg-warn/20 text-warn"
                                : log.level === "MESH"
                                ? "bg-accent/20 text-accent"
                                : "bg-surface text-faint"
                            }`}
                          >
                            {log.level}
                          </span>
                          <span
                            className={
                              log.level === "CRIT"
                                ? "text-critical font-medium"
                                : log.level === "WARN"
                                ? "text-warn"
                                : log.level === "MESH"
                                ? "text-accent"
                                : "text-muted"
                            }
                          >
                            {log.message}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </Panel>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
