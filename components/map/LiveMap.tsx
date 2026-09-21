"use client";

/**
 * components/map/LiveMap.tsx
 * Leaflet map with CARTO dark tiles.
 * Loaded client-side only (ssr: false) to avoid Leaflet SSR issues.
 * Phase 3 will add markers, mesh links, and node detail panel.
 */

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSimStore } from "@/store/simStore";
import { NODES } from "@/data/nodes";
import NodeMarkers from "./NodeMarkers";
import MeshLinks from "./MeshLinks";
import NodeDetailPanel from "./NodeDetailPanel";

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
        {/* CARTO dark tiles — no API key required */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
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
    </div>
  );
}
