/**
 * lib/simulation.ts
 * Pure, deterministic simulation engine.
 *
 * Input:  scenario ID + connectivity flags
 * Output: an ordered list of SimEvent[] with timestamps relative to `baseTime`
 *
 * No side effects. No store access. The UI just plays back the events.
 */

import type { SimEvent, SimEventType, NodeData } from "@/data/nodes";
import type { ScenarioId } from "@/data/messages";
import type { NetworkStatus } from "@/store/simStore";
import { propagateMesh, type MeshHop } from "./mesh";
import { buildMeshGraph } from "@/data/nodes";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScenarioResult {
  events: SimEvent[];
  /** The origin node of the scenario */
  originNodeId: string;
  /** Nodes reached by mesh propagation (in hop order) */
  meshHops: MeshHop[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _eventSeq = 0;
function makeId(): string {
  return `evt-${Date.now()}-${++_eventSeq}`;
}

function msToIso(baseTime: Date, offsetMs: number): string {
  return new Date(baseTime.getTime() + offsetMs).toISOString();
}

function makeEvent(
  type: SimEventType,
  nodeId: string,
  message: string,
  severity: SimEvent["severity"],
  baseTime: Date,
  offsetMs: number,
): SimEvent {
  return {
    id: makeId(),
    type,
    nodeId,
    timestamp: msToIso(baseTime, offsetMs),
    message,
    severity,
  };
}

// ─── Per-scenario event generation ───────────────────────────────────────────

function forestFireEvents(
  originNode: NodeData,
  baseTime: Date,
  nodes: NodeData[],
  networkStatus: NetworkStatus,
): ScenarioResult {
  const events: SimEvent[] = [];
  const id = originNode.id;
  const name = originNode.name;

  // t=0  Scenario start
  events.push(makeEvent("scenario_start", id,
    `Scenario: Forest Fire triggered at ${id} — ${name}`, "info", baseTime, 0));

  // t=500ms  Acoustic anomaly
  events.push(makeEvent("sensor_anomaly", id,
    `${id}: Acoustic anomaly — 78 dB (baseline 35 dB)`, "warn", baseTime, 500));

  // t=1200ms  Thermal check
  events.push(makeEvent("sensor_anomaly", id,
    `${id}: Thermal elevated — 68 °C surface (baseline 28 °C)`, "warn", baseTime, 1200));

  // t=2000ms  Smoke confirmed
  events.push(makeEvent("sensor_anomaly", id,
    `${id}: Smoke rising — 62 ppm (anomaly >50 ppm)`, "warn", baseTime, 2000));

  // t=2500ms  Confirmed
  events.push(makeEvent("sensor_confirmed", id,
    `${id}: FIRE CONFIRMED — confidence 94%. Mesh alert propagating.`, "critical", baseTime, 2500));

  // t=2600ms  Alert sent (via whichever links are available)
  const linkType = networkStatus.cellUp ? "cell" : networkStatus.loraUp ? "LoRa" : "satellite";
  events.push(makeEvent("alert_sent", id,
    `${id}: Alert dispatched via ${linkType.toUpperCase()} — calls + WhatsApp to regional contacts`, "critical", baseTime, 2600));

  // Mesh propagation
  const graph = buildMeshGraph(nodes);
  const hops = propagateMesh(id, graph, 900);

  hops.forEach((hop) => {
    events.push(makeEvent("mesh_hop", hop.nodeId,
      `Mesh hop ${hop.hopCount}: ${hop.nodeId} — alert received, relaying`,
      "info", baseTime, 2500 + hop.delayMs));
  });

  return { events, originNodeId: id, meshHops: hops };
}

function flashFloodEvents(
  originNode: NodeData,
  baseTime: Date,
  nodes: NodeData[],
  networkStatus: NetworkStatus,
): ScenarioResult {
  const events: SimEvent[] = [];
  const id = originNode.id;
  const name = originNode.name;

  events.push(makeEvent("scenario_start", id,
    `Scenario: Flash Flood triggered at ${id} — ${name}`, "info", baseTime, 0));

  events.push(makeEvent("sensor_anomaly", id,
    `${id}: Water level rising — +6 cm/min (alert threshold >5 cm/min)`, "warn", baseTime, 400));

  events.push(makeEvent("sensor_anomaly", id,
    `${id}: Turbidity spike — 142 NTU (baseline <10 NTU)`, "warn", baseTime, 900));

  events.push(makeEvent("sensor_anomaly", id,
    `${id}: Upstream node chain confirms rate-of-rise trend`, "warn", baseTime, 1500));

  events.push(makeEvent("sensor_confirmed", id,
    `${id}: FLOOD CONFIRMED — water +42 cm from baseline, rate +6 cm/min. Confidence 91%.`, "critical", baseTime, 2000));

  const linkType = networkStatus.cellUp ? "cell" : networkStatus.loraUp ? "LoRa" : "satellite";
  events.push(makeEvent("alert_sent", id,
    `${id}: Alert dispatched via ${linkType.toUpperCase()} — evacuation message sent to all contacts`, "critical", baseTime, 2100));

  const graph = buildMeshGraph(nodes);
  const hops = propagateMesh(id, graph, 900);

  hops.forEach((hop) => {
    events.push(makeEvent("mesh_hop", hop.nodeId,
      `Mesh hop ${hop.hopCount}: ${hop.nodeId} — flood alert received, relaying`,
      "info", baseTime, 2000 + hop.delayMs));
  });

  return { events, originNodeId: id, meshHops: hops };
}

function landslideEvents(
  originNode: NodeData,
  baseTime: Date,
  nodes: NodeData[],
  networkStatus: NetworkStatus,
): ScenarioResult {
  const events: SimEvent[] = [];
  const id = originNode.id;
  const name = originNode.name;

  events.push(makeEvent("scenario_start", id,
    `Scenario: Landslide triggered at ${id} — ${name}`, "info", baseTime, 0));

  events.push(makeEvent("sensor_anomaly", id,
    `${id}: Seismic micro-tremors detected — slope instability signal`, "warn", baseTime, 300));

  events.push(makeEvent("sensor_anomaly", id,
    `${id}: Soil moisture saturation — 94% (critical >90%)`, "warn", baseTime, 800));

  events.push(makeEvent("sensor_anomaly", id,
    `${id}: Acoustic crack pattern — slope movement initiated`, "warn", baseTime, 1400));

  events.push(makeEvent("sensor_confirmed", id,
    `${id}: LANDSLIDE CONFIRMED — slope movement >8 cm. Confidence 88%.`, "critical", baseTime, 2000));

  const linkType = networkStatus.cellUp ? "cell" : networkStatus.loraUp ? "LoRa" : "satellite";
  events.push(makeEvent("alert_sent", id,
    `${id}: Landslide alert via ${linkType.toUpperCase()} — evacuate hillside roads immediately`, "critical", baseTime, 2100));

  const graph = buildMeshGraph(nodes);
  const hops = propagateMesh(id, graph, 900);

  hops.forEach((hop) => {
    events.push(makeEvent("mesh_hop", hop.nodeId,
      `Mesh hop ${hop.hopCount}: ${hop.nodeId} — landslide alert received, relaying`,
      "info", baseTime, 2000 + hop.delayMs));
  });

  return { events, originNodeId: id, meshHops: hops };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Run a scenario and return timed events.
 *
 * @param scenarioId     - which scenario to simulate
 * @param nodes          - current node list (used to pick origin + build graph)
 * @param networkStatus  - current connectivity flags
 * @param baseTime       - simulation clock origin (defaults to now)
 */
export function runScenario(
  scenarioId: ScenarioId,
  nodes: NodeData[],
  networkStatus: NetworkStatus,
  baseTime: Date = new Date(),
): ScenarioResult {
  // Pick the scenario origin node
  const originNode = pickOriginNode(scenarioId, nodes);

  switch (scenarioId) {
    case "forest_fire":
      return forestFireEvents(originNode, baseTime, nodes, networkStatus);
    case "flash_flood":
      return flashFloodEvents(originNode, baseTime, nodes, networkStatus);
    case "landslide":
      return landslideEvents(originNode, baseTime, nodes, networkStatus);
  }
}

/** Pick a sensible origin node for each scenario */
function pickOriginNode(scenarioId: ScenarioId, nodes: NodeData[]): NodeData {
  switch (scenarioId) {
    case "forest_fire":
    case "landslide": {
      // WildSentry in Uttarakhand (WS-001 is the reference)
      const n = nodes.find((n) => n.id === "WS-001") ?? nodes.find((n) => n.type === "WildSentry");
      if (!n) throw new Error("No WildSentry node found for forest_fire/landslide scenario");
      return n;
    }
    case "flash_flood": {
      // HydroShield in Assam (HS-001 is the reference)
      const n = nodes.find((n) => n.id === "HS-001") ?? nodes.find((n) => n.type === "HydroShield");
      if (!n) throw new Error("No HydroShield node found for flash_flood scenario");
      return n;
    }
  }
}
