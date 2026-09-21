"use client";

/**
 * components/map/LiveMap.tsx
 * Leaflet map with Esri World Dark Gray Canvas tiles (keyless).
 * Loaded client-side only (ssr: false) to avoid Leaflet SSR issues.
 */

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSimStore } from "@/store/simStore";
import { NODES } from "@/data/nodes";
import NodeMarkers from "./NodeMarkers";
import MeshLinks from "./MeshLinks";
import NodeDetailPanel from "./NodeDetailPanel";
import AlertPanel from "@/components/alerts/AlertPanel";

// India center coordinates for initial view
const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
const INITIAL_ZOOM = 5;

/** Sync nodes from static data into the store on mount */
function NodeLoader() {
  const setNodes = useSimStore((s) => s.setNodes);
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current) {
      setNodes(NODES);
      loaded.current = true;
    }
  }, [setNodes]);

  return null;
}

/** Keep sim clock ticking */
function ClockTicker() {
  const setSimClock = useSimStore((s) => s.setSimClock);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setSimClock(`${hh}:${mm}:${ss}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [setSimClock]);

  return null;
}

export default function LiveMap() {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={INDIA_CENTER}
        zoom={INITIAL_ZOOM}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        attributionControl={true}
      >
        {/* Esri World Dark Gray Canvas tiles — keyless dark basemap */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
          maxZoom={16}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          maxZoom={16}
        />

        {/* Node markers and mesh links */}
        <NodeMarkers />
        <MeshLinks />

        {/* Helpers */}
        <NodeLoader />
        <ClockTicker />
      </MapContainer>

      {/* Node detail panel (overlaid) */}
      <NodeDetailPanel />

      {/* Alert experience panel (overlaid, bottom-right) */}
      <AlertPanel />
    </div>
  );
}
