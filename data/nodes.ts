/**
 * data/nodes.ts
 * Mock data: ~14 sensor nodes across 3 regions of India.
 * WildSentry = forest/hill fire+landslide detector
 * HydroShield = river/drain flood detector
 *
 * All coordinates are approximate real locations in each region.
 */

export type NodeType = "WildSentry" | "HydroShield";
export type NodeStatus = "ok" | "warn" | "critical" | "offline";
export type ConnectivityMode = "cell" | "lora" | "sat";

export interface NodeData {
  id: string;
  type: NodeType;
  name: string;
  region: "Uttarakhand" | "Assam" | "Kerala";
  lat: number;
  lng: number;

  // Real-time simulated sensor values
  battery: number;      // % charge
  solar: number;        // current solar input (Watts)
  signal: ConnectivityMode;
  status: NodeStatus;
  lastSeen: string;     // ISO timestamp (relative to sim clock)

  // Mesh neighbors (node IDs within LoRa range)
  neighbors: string[];

  // Type-specific sensor data
  sensors: NodeSensors;
}

export interface NodeSensors {
  // WildSentry
  acoustic?: number;    // dB — baseline ~35, anomaly >70
  thermal?: number;     // °C surface — baseline ~28, anomaly >60
  smoke?: number;       // ppm — baseline <10, anomaly >50

  // HydroShield
  waterLevel?: number;  // cm above baseline
  rateOfRise?: number;  // cm/min — alert >5 cm/min
  turbidity?: number;   // NTU — baseline <10, flood >100
}

export type SimEventType =
  | "sensor_anomaly"
  | "sensor_confirmed"
  | "alert_sent"
  | "mesh_hop"
  | "node_offline"
  | "node_recovered"
  | "scenario_start"
  | "scenario_reset";

export interface SimEvent {
  id: string;
  type: SimEventType;
  nodeId: string;
  timestamp: string;  // ISO
  message: string;
  severity: "info" | "warn" | "critical";
}

/** 14 nodes across 3 Indian regions */
export const NODES: NodeData[] = [
  // ── Uttarakhand region (WildSentry — forest fire / landslide) ──
  {
    id: "WS-001",
    type: "WildSentry",
    name: "Nainital Ridge North",
    region: "Uttarakhand",
    lat: 29.398,
    lng: 79.456,
    battery: 87,
    solar: 14.2,
    signal: "cell",
    status: "ok",
    lastSeen: "2026-09-21T06:37:00Z",
    neighbors: ["WS-002", "WS-003"],
    sensors: { acoustic: 37, thermal: 29, smoke: 4 },
  },
  {
    id: "WS-002",
    type: "WildSentry",
    name: "Bhowali Forest Edge",
    region: "Uttarakhand",
    lat: 29.365,
    lng: 79.512,
    battery: 73,
    solar: 11.8,
    signal: "lora",
    status: "ok",
    lastSeen: "2026-09-21T06:36:45Z",
    neighbors: ["WS-001", "WS-004"],
    sensors: { acoustic: 40, thermal: 31, smoke: 6 },
  },
  {
    id: "WS-003",
    type: "WildSentry",
    name: "Mukteshwar Upper Slope",
    region: "Uttarakhand",
    lat: 29.472,
    lng: 79.643,
    battery: 91,
    solar: 16.5,
    signal: "cell",
    status: "ok",
    lastSeen: "2026-09-21T06:37:10Z",
    neighbors: ["WS-001", "WS-004"],
    sensors: { acoustic: 33, thermal: 27, smoke: 3 },
  },
  {
    id: "WS-004",
    type: "WildSentry",
    name: "Almora Hill Station",
    region: "Uttarakhand",
    lat: 29.597,
    lng: 79.654,
    battery: 65,
    solar: 9.1,
    signal: "lora",
    status: "ok",
    lastSeen: "2026-09-21T06:36:20Z",
    neighbors: ["WS-002", "WS-003"],
    sensors: { acoustic: 41, thermal: 30, smoke: 5 },
  },

  // ── Assam region (HydroShield — Brahmaputra flood) ──
  {
    id: "HS-001",
    type: "HydroShield",
    name: "Guwahati River Gauge S1",
    region: "Assam",
    lat: 26.144,
    lng: 91.736,
    battery: 78,
    solar: 12.4,
    signal: "cell",
    status: "ok",
    lastSeen: "2026-09-21T06:37:15Z",
    neighbors: ["HS-002", "HS-003"],
    sensors: { waterLevel: 120, rateOfRise: 0.4, turbidity: 18 },
  },
  {
    id: "HS-002",
    type: "HydroShield",
    name: "Dibrugarh Upstream Post",
    region: "Assam",
    lat: 27.489,
    lng: 94.912,
    battery: 82,
    solar: 13.7,
    signal: "cell",
    status: "ok",
    lastSeen: "2026-09-21T06:37:08Z",
    neighbors: ["HS-001", "HS-004"],
    sensors: { waterLevel: 98, rateOfRise: 0.2, turbidity: 12 },
  },
  {
    id: "HS-003",
    type: "HydroShield",
    name: "Morigaon Flood Plain",
    region: "Assam",
    lat: 26.247,
    lng: 92.336,
    battery: 59,
    solar: 8.3,
    signal: "lora",
    status: "ok",
    lastSeen: "2026-09-21T06:36:55Z",
    neighbors: ["HS-001", "HS-004"],
    sensors: { waterLevel: 145, rateOfRise: 0.7, turbidity: 24 },
  },
  {
    id: "HS-004",
    type: "HydroShield",
    name: "Jorhat Drain Monitor",
    region: "Assam",
    lat: 26.747,
    lng: 94.219,
    battery: 88,
    solar: 14.9,
    signal: "cell",
    status: "ok",
    lastSeen: "2026-09-21T06:37:18Z",
    neighbors: ["HS-002", "HS-003"],
    sensors: { waterLevel: 88, rateOfRise: 0.1, turbidity: 9 },
  },

  // ── Kerala region (WildSentry + HydroShield mix) ──
  {
    id: "WS-K01",
    type: "WildSentry",
    name: "Wayanad Forest Watch",
    region: "Kerala",
    lat: 11.686,
    lng: 76.132,
    battery: 94,
    solar: 17.2,
    signal: "cell",
    status: "ok",
    lastSeen: "2026-09-21T06:37:20Z",
    neighbors: ["WS-K02", "HS-K01"],
    sensors: { acoustic: 35, thermal: 28, smoke: 3 },
  },
  {
    id: "WS-K02",
    type: "WildSentry",
    name: "Munnar High Range",
    region: "Kerala",
    lat: 10.089,
    lng: 77.059,
    battery: 76,
    solar: 11.6,
    signal: "lora",
    status: "ok",
    lastSeen: "2026-09-21T06:36:40Z",
    neighbors: ["WS-K01", "HS-K02"],
    sensors: { acoustic: 38, thermal: 26, smoke: 4 },
  },
  {
    id: "HS-K01",
    type: "HydroShield",
    name: "Periyar River Watch",
    region: "Kerala",
    lat: 10.184,
    lng: 76.388,
    battery: 83,
    solar: 13.1,
    signal: "cell",
    status: "ok",
    lastSeen: "2026-09-21T06:37:05Z",
    neighbors: ["WS-K01", "HS-K02"],
    sensors: { waterLevel: 110, rateOfRise: 0.3, turbidity: 15 },
  },
  {
    id: "HS-K02",
    type: "HydroShield",
    name: "Kochi Backwater South",
    region: "Kerala",
    lat: 9.939,
    lng: 76.270,
    battery: 70,
    solar: 10.8,
    signal: "cell",
    status: "ok",
    lastSeen: "2026-09-21T06:36:58Z",
    neighbors: ["WS-K02", "HS-K01"],
    sensors: { waterLevel: 78, rateOfRise: 0.1, turbidity: 8 },
  },
  {
    id: "HS-K03",
    type: "HydroShield",
    name: "Alappuzha Canal Gauge",
    region: "Kerala",
    lat: 9.498,
    lng: 76.339,
    battery: 62,
    solar: 9.4,
    signal: "lora",
    status: "ok",
    lastSeen: "2026-09-21T06:36:30Z",
    neighbors: ["HS-K02"],
    sensors: { waterLevel: 95, rateOfRise: 0.2, turbidity: 11 },
  },
  {
    id: "WS-K03",
    type: "WildSentry",
    name: "Idukki Dam Hillside",
    region: "Kerala",
    lat: 9.854,
    lng: 76.974,
    battery: 89,
    solar: 15.3,
    signal: "cell",
    status: "ok",
    lastSeen: "2026-09-21T06:37:22Z",
    neighbors: ["WS-K02", "HS-K01"],
    sensors: { acoustic: 36, thermal: 29, smoke: 4 },
  },
];

/** Adjacency map: nodeId → neighbor nodeIds (derived from NODES) */
export function buildMeshGraph(nodes: NodeData[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  nodes.forEach((n) => graph.set(n.id, n.neighbors));
  return graph;
}
