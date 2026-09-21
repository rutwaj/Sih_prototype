"use client";

/**
 * components/map/NodeMarkers.tsx
 * Renders custom SVG markers for each node on the Leaflet map.
 * WildSentry = flame icon, HydroShield = water-drop icon.
 * Colors reflect node status: ok/warn/critical/offline.
 */

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useSimStore } from "@/store/simStore";
import { TOKEN_COLORS } from "@/lib/tokenColors";
import type { NodeData, NodeStatus } from "@/data/nodes";

/** Map status → token color */
const STATUS_COLOR: Record<NodeStatus, string> = {
  ok:       TOKEN_COLORS.ok,
  warn:     TOKEN_COLORS.warn,
  critical: TOKEN_COLORS.critical,
  offline:  TOKEN_COLORS.faint,
};

/** Create a custom Leaflet DivIcon with an SVG marker */
function makeIcon(node: NodeData): L.DivIcon {
  const color = STATUS_COLOR[node.status];
  const isWild = node.type === "WildSentry";

  // SVG: outer circle + inner symbol
  const svg = isWild
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
        <path d="M14 20c-2.5-1.5-5-4-4-7 1-3 3-4 4-6 1 2 3 3 4 6 1 3-1.5 5.5-4 7z" fill="${color}"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
        <path d="M14 8c0 0-5 5-5 9a5 5 0 0 0 10 0c0-4-5-9-5-9z" fill="${color}"/>
      </svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export default function NodeMarkers() {
  const nodes = useSimStore((s) => s.nodes);
  const setSelectedNodeId = useSimStore((s) => s.setSelectedNodeId);

  return (
    <>
      {nodes.map((node) => (
        <Marker
          key={node.id}
          position={[node.lat, node.lng]}
          icon={makeIcon(node)}
          eventHandlers={{
            click: () => setSelectedNodeId(node.id),
          }}
        >
          <Popup>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", minWidth: "140px" }}>
              <strong style={{ display: "block", marginBottom: "4px" }}>
                {node.id} — {node.name}
              </strong>
              <span style={{ color: STATUS_COLOR[node.status] }}>
                {node.status.toUpperCase()}
              </span>
              <br />
              <span style={{ color: TOKEN_COLORS.muted }}>
                {node.type} · {node.region}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
