/**
 * app/page.tsx — Live Map home page
 * The map component is loaded client-side only (Leaflet requires browser DOM).
 */
import { Metadata } from "next";
import DynamicLiveMap from "@/components/map/DynamicLiveMap";
import SimControlPanel from "@/components/sim/SimControlPanel";

export const metadata: Metadata = {
  title: "Live Map — ResiliNet-AI",
};

export default function HomePage() {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 relative">
        <DynamicLiveMap />
      </div>

      <aside className="w-80 flex-shrink-0 border-l border-line bg-surface flex flex-col overflow-hidden">
        <SimControlPanel />
      </aside>
    </div>
  );
}