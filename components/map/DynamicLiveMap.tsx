"use client";

import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("./LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-bg">
      <p className="text-muted text-sm font-mono">Loading map...</p>
    </div>
  ),
});

export default function DynamicLiveMap() {
  return <LiveMap />;
}