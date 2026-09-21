import { create } from "zustand";
import type { NodeStatus, SimEvent, NodeData } from "@/data/nodes";

/** Connectivity flags */
export interface NetworkStatus {
  gridUp: boolean;
  cellUp: boolean;
  loraUp: boolean;
}

/** Active alert information */
export interface ActiveAlert {
  scenarioId: string;
  triggeredAt: string; // ISO timestamp
  affectedNodeIds: string[];
  phase: "detecting" | "verifying" | "confirmed" | "propagating";
  confidence: number; // 0-100
}

interface SimState {
  // Nodes
  nodes: NodeData[];
  setNodes: (nodes: NodeData[]) => void;
  updateNodeStatus: (nodeId: string, status: NodeStatus) => void;

  // Simulation clock (formatted string)
  simClock: string;
  setSimClock: (clock: string) => void;

  // Simulation running state
  simRunning: boolean;
  simSpeed: 1 | 2 | 4;
  setSimRunning: (running: boolean) => void;
  setSimSpeed: (speed: 1 | 2 | 4) => void;

  // Network connectivity
  networkStatus: NetworkStatus;
  setNetworkStatus: (status: Partial<NetworkStatus>) => void;

  // Events log
  events: SimEvent[];
  addEvent: (event: SimEvent) => void;
  clearEvents: () => void;

  // Active alert
  activeAlert: ActiveAlert | null;
  setActiveAlert: (alert: ActiveAlert | null) => void;

  // Selected node (for detail panel)
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // Audio
  muted: boolean;
  setMuted: (muted: boolean) => void;
  soundEnabled: boolean; // user has clicked "Enable sound"
  setSoundEnabled: (enabled: boolean) => void;

  // Reset all simulation state
  resetSim: () => void;
}

/** Initial network status: everything up */
const DEFAULT_NETWORK: NetworkStatus = {
  gridUp: true,
  cellUp: true,
  loraUp: true,
};

export const useSimStore = create<SimState>((set) => ({
  // Nodes
  nodes: [],
  setNodes: (nodes) => set({ nodes }),
  updateNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, status } : n
      ),
    })),

  // Sim clock
  simClock: "--:--:--",
  setSimClock: (simClock) => set({ simClock }),

  // Simulation control
  simRunning: false,
  simSpeed: 1,
  setSimRunning: (simRunning) => set({ simRunning }),
  setSimSpeed: (simSpeed) => set({ simSpeed }),

  // Network
  networkStatus: DEFAULT_NETWORK,
  setNetworkStatus: (status) =>
    set((state) => ({
      networkStatus: { ...state.networkStatus, ...status },
    })),

  // Events
  events: [],
  addEvent: (event) =>
    set((state) => ({
      // Keep latest 200 events
      events: [event, ...state.events].slice(0, 200),
    })),
  clearEvents: () => set({ events: [] }),

  // Alert
  activeAlert: null,
  setActiveAlert: (activeAlert) => set({ activeAlert }),

  // Selected node
  selectedNodeId: null,
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),

  // Audio
  muted: false,
  setMuted: (muted) => set({ muted }),
  soundEnabled: false,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

  // Reset
  resetSim: () =>
    set((state) => ({
      simRunning: false,
      simClock: "--:--:--",
      networkStatus: DEFAULT_NETWORK,
      events: [],
      activeAlert: null,
      selectedNodeId: null,
      // Restore all nodes to ok/idle status
      nodes: state.nodes.map((n) => ({ ...n, status: "ok" as NodeStatus })),
    })),
}));
