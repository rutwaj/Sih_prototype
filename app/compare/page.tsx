import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Old vs ResiliNet — Compare",
};

export default function ComparePage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-medium text-text mb-1">Old System vs ResiliNet-AI</h1>
      <p className="text-sm text-muted mb-6">
        Same event, two synchronized timelines. See how LoRa mesh delivers warnings in seconds
        even when grid power and cell towers fail.
      </p>
      <div className="rounded-lg border border-line bg-surface p-6 text-muted text-sm">
        Phase 6 — Compare view coming soon.
      </div>
    </div>
  );
}
