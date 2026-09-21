/**
 * lib/mesh.ts
 * Pure mesh propagation engine using BFS.
 * Input:  origin node ID, mesh adjacency graph, per-hop delay (ms in sim time)
 * Output: ordered list of { nodeId, hopCount, delayMs } describing alert spread.
 *
 * No side effects. No store access. Fully deterministic.
 */

export interface MeshHop {
  nodeId: string;
  hopCount: number;       // how many hops from origin
  delayMs: number;        // cumulative delay from trigger (wall-clock ms)
}

/**
 * BFS across the mesh graph starting from `originId`.
 * Returns a flat list of hops in BFS order.
 *
 * @param originId     - node where the alert originates
 * @param graph        - adjacency map: nodeId → neighbor nodeIds
 * @param perHopDelayMs - delay added per hop (sim-wall-clock ms)
 */
export function propagateMesh(
  originId: string,
  graph: Map<string, string[]>,
  perHopDelayMs: number = 800,
): MeshHop[] {
  const visited = new Set<string>([originId]);
  const queue: Array<{ nodeId: string; hopCount: number }> = [
    { nodeId: originId, hopCount: 0 },
  ];
  const hops: MeshHop[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = graph.get(current.nodeId) ?? [];

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        const hop: MeshHop = {
          nodeId: neighborId,
          hopCount: current.hopCount + 1,
          delayMs: (current.hopCount + 1) * perHopDelayMs,
        };
        hops.push(hop);
        queue.push({ nodeId: neighborId, hopCount: current.hopCount + 1 });
      }
    }
  }

  return hops;
}
