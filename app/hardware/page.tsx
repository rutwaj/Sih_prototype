import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hardware & Cost — ResiliNet-AI",
};

export default function HardwarePage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-medium text-text mb-1">Hardware &amp; Cost</h1>
      <p className="text-sm text-muted mb-6">
        Bill of materials, approximate INR cost per node, and system block diagram.
        Costs are estimates — actual prices vary by vendor and quantity.
      </p>
      <div className="rounded-lg border border-line bg-surface p-6 text-muted text-sm">
        Phase 6 — Hardware view coming soon.
      </div>
    </div>
  );
}
