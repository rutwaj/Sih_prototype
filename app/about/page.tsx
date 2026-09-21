import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — ResiliNet-AI",
};

export default function AboutPage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-medium text-text mb-1">About ResiliNet-AI</h1>
      <p className="text-sm text-muted mb-6 leading-relaxed">
        This is a <strong className="text-text font-medium">simulation dashboard</strong> demonstrating
        how a network of solar-powered edge sensor nodes — WildSentry (forest/hill) and HydroShield
        (river/drain) — can detect fires, landslides and floods locally and trigger instant, inclusive
        local alerts even when grid power and cell towers fail.
      </p>

      <div className="space-y-4 text-sm text-muted leading-relaxed">
        <div className="border-l-2 border-accent pl-4">
          <p className="text-text font-medium mb-1">Honest technical framing</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Flood detection uses rate-of-rise plus upstream node chaining — not magic prediction.</li>
            <li>Satellite uplink is an optional fallback. LoRa mesh is the primary offline link.</li>
            <li>All data in this demo is simulated. No real hardware is connected.</li>
          </ul>
        </div>

        <div className="border-l-2 border-line pl-4">
          <p className="text-text font-medium mb-1">Qualcomm edge AI context</p>
          <p>
            In a production deployment, the sensor DSP and anomaly-detection inference would run on
            a Qualcomm edge SoC (e.g. QCS6490 or equivalent), providing on-device AI without cloud
            dependency. The simulation models the same event timings that on-device inference enables.
          </p>
        </div>

        <div className="border-l-2 border-line pl-4">
          <p className="text-text font-medium mb-1">Built for</p>
          <p>Qualcomm Problem Statement 26178 — AI-powered environmental monitoring network,
          Smart India Hackathon 2026.</p>
        </div>
      </div>
    </div>
  );
}
