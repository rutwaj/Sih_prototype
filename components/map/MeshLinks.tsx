"use client";

/**
 * components/map/MeshLinks.tsx
 * Draws thin polylines between mesh-neighbor nodes on the Leaflet map.
 * Line color reflects activity: info (active alert propagation) or line (idle).
 */

import { Polyline } from "react-leaflet";
import { useSimStore } from "@/store/simStore";
import { TOKEN_COLORS } from "@/lib/tokenColors";

const IDLE_COLOR = TOKEN_COLORS.line;
const ACTIVE_COLOR = TOKEN_COLORS.info;

export default function MeshLinks() {
  const nodes = useSimStore((s) => s.nodes);
  const activeAlert = useSimStore((s) => s.activeAlert);

  // Build a set of edges (avoid duplicates — only draw A→B, not B→A)
  const edges = new Set<string>();
  const lines: Array<{
    key: string;
    positions: [[number, number], [number, number]];
    active: boolean;
  }> = [];

  nodes.forEach((node) => {
    node.neighbors.forEach((neighborId) => {
      const edgeKey =
        node.id < neighborId
          ? `${node.id}-${neighborId}`
          : `${neighborId}-${node.id}`;

      if (!edges.has(edgeKey)) {
        edges.add(edgeKey);
        const neighbor = nodes.find((n) => n.id === neighborId);
        if (!neighbor) return;

        // Is this edge involved in an active alert propagation?
        const isActive =
          activeAlert !== null &&
          activeAlert.affectedNodeIds.includes(node.id) &&
          activeAlert.affectedNodeIds.includes(neighborId);

        lines.push({
          key: edgeKey,
          positions: [
            [node.lat, node.lng],
            [neighbor.lat, neighbor.lng],
          ],
          active: isActive,
        });
      }
    });
  });

  return (
    <>
      {lines.map(({ key, positions, active }) => (
        <Polyline
          key={key}
          positions={positions}
          pathOptions={{
            color: active ? ACTIVE_COLOR : IDLE_COLOR,
            weight: active ? 2 : 1,
            opacity: active ? 0.9 : 0.5,
            dashArray: active ? undefined : "4 4",
          }}
        />
      ))}
    </>
  );
}
