"use client";

/**
 * app/hardware/page.tsx
 * Hardware & Cost view: Bill of Materials (BOM), system block diagram (SVG),
 * and Qualcomm edge AI architectural breakdown.
 */

import { useState } from "react";
import {
  Zap,
  DollarSign,
  Sparkles,
  Flame,
  Droplets,
  Info,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import Stat from "@/components/ui/Stat";
import { TOKEN_COLORS } from "@/lib/tokenColors";

interface BOMItem {
  id: string;
  category: "compute" | "sensing" | "comms" | "power" | "actuation" | "enclosure";
  name: string;
  partSpec: string;
  purpose: string;
  qty: number;
  estCostINR: number;
}

const WILDSENTRY_BOM: BOMItem[] = [
  {
    id: "ws-1",
    category: "compute",
    name: "Qualcomm Edge AI SoC",
    partSpec: "Qualcomm QCS6490 / RB3 Gen 2 or ESP32-S3 Edge AI module",
    purpose: "On-device quantized ML inference (acoustic fire pattern & thermal anomaly)",
    qty: 1,
    estCostINR: 3200,
  },
  {
    id: "ws-2",
    category: "sensing",
    name: "Far-Infrared Thermal Array",
    partSpec: "MLX90640 32×24 IR Array Sensor (55° FOV)",
    purpose: "Surface temperature canopy thermal hotspot verification",
    qty: 1,
    estCostINR: 2800,
  },
  {
    id: "ws-3",
    category: "sensing",
    name: "MEMS Acoustic Sensor Array",
    partSpec: "Knowles I2S Ultra-Low-Power Digital Microphone Array",
    purpose: "Continuous acoustic fire crackle and slope rockfall frequency detection",
    qty: 1,
    estCostINR: 450,
  },
  {
    id: "ws-4",
    category: "sensing",
    name: "Slope Slip & Particulate Sensor",
    partSpec: "60 GHz mmWave Radar + Optical Smoke/Particulate Chamber",
    purpose: "Slope displacement slip monitoring and optical particulate verification",
    qty: 1,
    estCostINR: 1400,
  },
  {
    id: "ws-5",
    category: "comms",
    name: "Long-Range LoRa Transceiver",
    partSpec: "Semtech SX1262 (865-867 MHz IN865 band, +22 dBm)",
    purpose: "Peer-to-peer decentralized mesh relay up to 12 km line-of-sight",
    qty: 1,
    estCostINR: 850,
  },
  {
    id: "ws-6",
    category: "comms",
    name: "Cellular / Satellite NTN Module",
    partSpec: "Quectel BG95-M3 Cat-M1/NB-IoT + Satellite NTN fallback",
    purpose: "Secondary cloud gateway link when cellular towers are operational",
    qty: 1,
    estCostINR: 1200,
  },
  {
    id: "ws-7",
    category: "power",
    name: "LiFePO4 High-Cycle Battery",
    partSpec: "12.8V 10Ah (128 Wh) LiFePO4 Pack (3000+ cycles, -20°C to +60°C)",
    purpose: "7+ days continuous zero-sunlight autonomy buffer",
    qty: 1,
    estCostINR: 2200,
  },
  {
    id: "ws-8",
    category: "power",
    name: "Solar PV + MPPT Controller",
    partSpec: "20W Monocrystalline PV Panel + Integrated MPPT Charge Controller",
    purpose: "Rapid daylight recharge even in heavy forest canopy shade",
    qty: 1,
    estCostINR: 1100,
  },
  {
    id: "ws-9",
    category: "actuation",
    name: "Local Siren, Strobe & Speaker",
    partSpec: "110 dB 12V Siren Horn + 3W Speaker + Amber LED Strobe (≤3 Hz)",
    purpose: "Instant physical audio/visual evacuation warning directly in the danger zone",
    qty: 1,
    estCostINR: 950,
  },
  {
    id: "ws-10",
    category: "enclosure",
    name: "IP67 Enclosure & Mounts",
    partSpec: "UV-stabilized Polycarbonate Enclosure + Universal Tree/Mast Bracket",
    purpose: "Harsh weatherproofing against extreme monsoon and frost",
    qty: 1,
    estCostINR: 650,
  },
];

const HYDROSHIELD_BOM: BOMItem[] = [
  {
    id: "hs-1",
    category: "compute",
    name: "Qualcomm Edge AI SoC",
    partSpec: "Qualcomm QCS6490 / ESP32-S3 Edge AI Module",
    purpose: "On-device rate-of-rise trend extrapolation and multi-sensor fusion",
    qty: 1,
    estCostINR: 3200,
  },
  {
    id: "hs-2",
    category: "sensing",
    name: "24 GHz FMCW Radar Level Gauge",
    partSpec: "Non-contact 24 GHz FMCW Radar Sensor (0-15m range, ±2mm precision)",
    purpose: "Continuous river/canal water level measurement immune to debris",
    qty: 1,
    estCostINR: 3400,
  },
  {
    id: "hs-3",
    category: "sensing",
    name: "Optical Turbidity & Pressure Probe",
    partSpec: "Submersible 0-1000 NTU Turbidity Probe + Hydrostatic Pressure Sensor",
    purpose: "Detects rapid sediment runoff surge confirming cloudburst/flash flood",
    qty: 1,
    estCostINR: 1650,
  },
  {
    id: "hs-4",
    category: "comms",
    name: "Long-Range LoRa Transceiver",
    partSpec: "Semtech SX1262 (865-867 MHz IN865 band, +22 dBm)",
    purpose: "Peer-to-peer upstream and downstream mesh chaining along riverbanks",
    qty: 1,
    estCostINR: 850,
  },
  {
    id: "hs-5",
    category: "comms",
    name: "Cellular / Satellite NTN Module",
    partSpec: "Quectel BG95-M3 Cat-M1/NB-IoT + Satellite NTN fallback",
    purpose: "Cloud synchronization when cellular networks are online",
    qty: 1,
    estCostINR: 1200,
  },
  {
    id: "hs-6",
    category: "power",
    name: "LiFePO4 High-Cycle Battery",
    partSpec: "12.8V 12Ah (153 Wh) LiFePO4 Pack (3000+ cycles)",
    purpose: "Extended multi-day flood autonomy buffer",
    qty: 1,
    estCostINR: 2500,
  },
  {
    id: "hs-7",
    category: "power",
    name: "Solar PV + MPPT Controller",
    partSpec: "25W Monocrystalline PV Panel + Integrated MPPT Charge Controller",
    purpose: "Autonomous solar recharging on riverbanks and bridge pylons",
    qty: 1,
    estCostINR: 1350,
  },
  {
    id: "hs-8",
    category: "actuation",
    name: "Riverbank Siren, Strobe & Speaker",
    partSpec: "110 dB Siren Horn + High-Power Voice Speaker + Red LED Strobe",
    purpose: "Immediate audible evacuation alarms for ghats, fishermen, and low-lying settlements",
    qty: 1,
    estCostINR: 950,
  },
  {
    id: "hs-9",
    category: "enclosure",
    name: "IP68 Submersible Enclosure & Mounts",
    partSpec: "Marine-grade 316 Stainless Steel + IP68 Polycarbonate Stanchion Mount",
    purpose: "Survives total flood submersion and debris impact",
    qty: 1,
    estCostINR: 1100,
  },
];

export default function HardwarePage() {
  const [activeTab, setActiveTab] = useState<"wildsentry" | "hydroshield">("wildsentry");

  const currentBOM = activeTab === "wildsentry" ? WILDSENTRY_BOM : HYDROSHIELD_BOM;
  const totalCost = currentBOM.reduce((sum, item) => sum + item.estCostINR * item.qty, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-medium text-text">Hardware Architecture &amp; Bill of Materials</h1>
          <Badge status="ok" label="ESTIMATED BOM" size="sm" />
        </div>
        <p className="text-sm text-muted">
          Edge sensor hardware architecture, itemized INR component costing, and Qualcomm edge AI
          silicon placement for autonomous disaster mitigation.
        </p>
      </div>

      {/* Node Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-2">
        <Button
          variant={activeTab === "wildsentry" ? "default" : "ghost"}
          size="sm"
          icon={<Flame size={13} strokeWidth={1.5} />}
          onClick={() => setActiveTab("wildsentry")}
        >
          WildSentry (Forest Fire &amp; Landslide Node)
        </Button>
        <Button
          variant={activeTab === "hydroshield" ? "default" : "ghost"}
          size="sm"
          icon={<Droplets size={13} strokeWidth={1.5} />}
          onClick={() => setActiveTab("hydroshield")}
        >
          HydroShield (River Gauge &amp; Flood Node)
        </Button>
      </div>

      {/* Cost Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-line bg-surface">
          <Stat
            label="Estimated Cost Per Node"
            value={`₹${totalCost.toLocaleString("en-IN")}`}
            icon={<DollarSign size={13} strokeWidth={1.5} className="text-ok" />}
            valueClassName="text-ok text-xl font-semibold"
            sublabel="Batch quantity 500+ units estimate"
          />
        </div>
        <div className="p-4 rounded-lg border border-line bg-surface">
          <Stat
            label="Legacy Telemetry Tower"
            value="₹5,50,000+"
            icon={<DollarSign size={13} strokeWidth={1.5} className="text-faint" />}
            valueClassName="text-muted text-xl font-semibold"
            sublabel="Traditional industrial telemetry station"
          />
        </div>
        <div className="p-4 rounded-lg border border-line bg-surface">
          <Stat
            label="Cost Reduction"
            value="~97% Lower"
            icon={<Zap size={13} strokeWidth={1.5} className="text-accent" />}
            valueClassName="text-accent text-xl font-semibold"
            sublabel="Enables high-density spatial mesh coverage"
          />
        </div>
        <div className="p-4 rounded-lg border border-line bg-surface">
          <Stat
            label="Autonomy Buffer"
            value="7+ Days"
            icon={<Zap size={13} strokeWidth={1.5} className="text-info" />}
            valueClassName="text-info text-xl font-semibold"
            sublabel="Zero sunlight continuous runtime"
          />
        </div>
      </div>

      {/* System Block Diagram */}
      <Panel title="System Block Diagram (Autonomous Edge Node Architecture)">
        <div className="w-full overflow-x-auto py-2">
          <svg
            viewBox="0 0 940 380"
            className="w-full min-w-[760px] h-auto font-sans"
            style={{ maxHeight: "380px" }}
          >
            {/* Background Canvas */}
            <rect width="940" height="380" fill={TOKEN_COLORS.surface} rx="8" />

            {/* Subsystem 1: Power (Left) */}
            <g transform="translate(20, 20)">
              <rect
                width="160"
                height="340"
                fill={TOKEN_COLORS["surface-2"]}
                stroke={TOKEN_COLORS.line}
                strokeWidth="1"
                rx="6"
              />
              <text x="14" y="24" fill={TOKEN_COLORS.text} fontSize="12" fontWeight="600">
                POWER SUBSYSTEM
              </text>

              {/* Solar Panel */}
              <rect x="14" y="44" width="132" height="58" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
              <text x="22" y="66" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">20W-25W Solar PV</text>
              <text x="22" y="82" fill={TOKEN_COLORS.faint} fontSize="9" fontFamily="monospace">Monocrystalline</text>

              {/* MPPT */}
              <rect x="14" y="116" width="132" height="58" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
              <text x="22" y="138" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">MPPT Controller</text>
              <text x="22" y="154" fill={TOKEN_COLORS.accent} fontSize="9" fontFamily="monospace">98% Efficient</text>

              {/* LiFePO4 Battery */}
              <rect x="14" y="188" width="132" height="66" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
              <text x="22" y="210" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">LiFePO4 Battery</text>
              <text x="22" y="226" fill={TOKEN_COLORS.ok} fontSize="9" fontFamily="monospace">12.8V 10-12Ah (128Wh)</text>
              <text x="22" y="240" fill={TOKEN_COLORS.faint} fontSize="9" fontFamily="monospace">3000+ Cycles</text>

              {/* Power PMIC */}
              <rect x="14" y="268" width="132" height="56" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
              <text x="22" y="290" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">DC-DC Regulators</text>
              <text x="22" y="306" fill={TOKEN_COLORS.faint} fontSize="9" fontFamily="monospace">3.3V / 5V / 12V Rails</text>
            </g>

            {/* Subsystem 2: Sensors (Top Center) */}
            <g transform="translate(205, 20)">
              <rect
                width="200"
                height="340"
                fill={TOKEN_COLORS["surface-2"]}
                stroke={TOKEN_COLORS.line}
                strokeWidth="1"
                rx="6"
              />
              <text x="14" y="24" fill={TOKEN_COLORS.text} fontSize="12" fontWeight="600">
                MULTI-MODAL SENSORS
              </text>

              {activeTab === "wildsentry" ? (
                <>
                  <rect x="14" y="44" width="172" height="62" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
                  <text x="22" y="66" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">Thermal IR Array</text>
                  <text x="22" y="82" fill={TOKEN_COLORS.warn} fontSize="9" fontFamily="monospace">MLX90640 (32×24 px)</text>
                  <text x="22" y="94" fill={TOKEN_COLORS.faint} fontSize="8">Canopy Hotspot Check</text>

                  <rect x="14" y="118" width="172" height="62" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
                  <text x="22" y="140" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">MEMS Acoustic Mic</text>
                  <text x="22" y="156" fill={TOKEN_COLORS.accent} fontSize="9" fontFamily="monospace">I2S DSP Acoustic Stream</text>
                  <text x="22" y="168" fill={TOKEN_COLORS.faint} fontSize="8">Crackle / Rockfall Audio</text>

                  <rect x="14" y="192" width="172" height="62" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
                  <text x="22" y="214" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">60 GHz mmWave Radar</text>
                  <text x="22" y="230" fill={TOKEN_COLORS.info} fontSize="9" fontFamily="monospace">Slope Slip Displacement</text>
                  <text x="22" y="242" fill={TOKEN_COLORS.faint} fontSize="8">Sub-centimeter Drift</text>

                  <rect x="14" y="266" width="172" height="58" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
                  <text x="22" y="288" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">Optical Particulate Chamber</text>
                  <text x="22" y="304" fill={TOKEN_COLORS.warn} fontSize="9" fontFamily="monospace">0-500 ppm Smoke Density</text>
                </>
              ) : (
                <>
                  <rect x="14" y="44" width="172" height="66" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
                  <text x="22" y="66" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">24 GHz FMCW Radar</text>
                  <text x="22" y="82" fill={TOKEN_COLORS.info} fontSize="9" fontFamily="monospace">0-15m Range (±2mm)</text>
                  <text x="22" y="96" fill={TOKEN_COLORS.faint} fontSize="8">Non-contact River Gauge</text>

                  <rect x="14" y="122" width="172" height="66" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
                  <text x="22" y="144" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">Optical Turbidity Probe</text>
                  <text x="22" y="160" fill={TOKEN_COLORS.warn} fontSize="9" fontFamily="monospace">0-1000 NTU Immersion</text>
                  <text x="22" y="174" fill={TOKEN_COLORS.faint} fontSize="8">Heavy Runoff Surge Check</text>

                  <rect x="14" y="200" width="172" height="66" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
                  <text x="22" y="222" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">Hydrostatic Pressure</text>
                  <text x="22" y="238" fill={TOKEN_COLORS.ok} fontSize="9" fontFamily="monospace">Dual-redundancy Gauge</text>
                  <text x="22" y="252" fill={TOKEN_COLORS.faint} fontSize="8">Submersible Transducer</text>

                  <rect x="14" y="278" width="172" height="48" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
                  <text x="22" y="300" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">Doppler Velocity Sensor</text>
                  <text x="22" y="314" fill={TOKEN_COLORS.faint} fontSize="9" fontFamily="monospace">Water Flow Velocity</text>
                </>
              )}
            </g>

            {/* Subsystem 3: Qualcomm Edge AI Core (Center) */}
            <g transform="translate(430, 20)">
              <rect
                width="240"
                height="340"
                fill={TOKEN_COLORS["surface-2"]}
                stroke={TOKEN_COLORS.accent}
                strokeWidth="1.5"
                rx="6"
              />
              <text x="16" y="24" fill={TOKEN_COLORS.accent} fontSize="12" fontWeight="600">
                QUALCOMM EDGE AI CORE
              </text>

              {/* SoC Box */}
              <rect x="14" y="44" width="212" height="130" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.accent} strokeWidth="1" rx="4" />
              <text x="24" y="68" fill={TOKEN_COLORS.text} fontSize="13" fontWeight="600">
                Qualcomm Edge AI SoC
              </text>
              <text x="24" y="86" fill={TOKEN_COLORS.accent} fontSize="10" fontFamily="monospace">
                Hexagon™ NPU + Low-Power DSP
              </text>

              <rect x="24" y="98" width="192" height="24" fill={TOKEN_COLORS["surface-2"]} rx="2" />
              <text x="32" y="114" fill={TOKEN_COLORS.text} fontSize="9">
                ⚡ Acoustic Waveform CNN Classifier
              </text>

              <rect x="24" y="128" width="192" height="24" fill={TOKEN_COLORS["surface-2"]} rx="2" />
              <text x="32" y="144" fill={TOKEN_COLORS.text} fontSize="9">
                ⚡ Thermal &amp; Hydrology Trend Engine
              </text>

              <text x="24" y="166" fill={TOKEN_COLORS.ok} fontSize="9" fontFamily="monospace">
                Latency: &lt;45ms | Zero Cloud Dependency
              </text>

              {/* Edge Firmware & Decision Engine */}
              <rect x="14" y="186" width="212" height="138" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
              <text x="24" y="208" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="600">
                Decentralized Mesh Engine
              </text>
              <text x="24" y="226" fill={TOKEN_COLORS.faint} fontSize="9">
                • Dynamic Multi-hop BFS Routing
              </text>
              <text x="24" y="242" fill={TOKEN_COLORS.faint} fontSize="9">
                • Cryptographic Token Authentication
              </text>
              <text x="24" y="258" fill={TOKEN_COLORS.faint} fontSize="9">
                • Multi-lingual Voice Synthesizer
              </text>
              <text x="24" y="274" fill={TOKEN_COLORS.faint} fontSize="9">
                • Local Strobe / Siren Actuation Logic
              </text>
              <text x="24" y="304" fill={TOKEN_COLORS.accent} fontSize="9" fontFamily="monospace">
                Solar Power Budget: 1.2W Avg
              </text>
            </g>

            {/* Subsystem 4: Comms & Actuators (Right) */}
            <g transform="translate(695, 20)">
              <rect
                width="225"
                height="340"
                fill={TOKEN_COLORS["surface-2"]}
                stroke={TOKEN_COLORS.line}
                strokeWidth="1"
                rx="6"
              />
              <text x="14" y="24" fill={TOKEN_COLORS.text} fontSize="12" fontWeight="600">
                COMMS &amp; ACTUATION
              </text>

              {/* LoRa Mesh */}
              <rect x="14" y="44" width="197" height="64" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.ok} strokeWidth="1" rx="4" />
              <text x="22" y="66" fill={TOKEN_COLORS.ok} fontSize="11" fontWeight="600">LoRa Mesh Transceiver</text>
              <text x="22" y="82" fill={TOKEN_COLORS.text} fontSize="9" fontFamily="monospace">SX1262 (865 MHz IN865)</text>
              <text x="22" y="96" fill={TOKEN_COLORS.faint} fontSize="8">Up to 12 km Node-to-Node</text>

              {/* Cellular & Sat Fallback */}
              <rect x="14" y="120" width="197" height="60" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
              <text x="22" y="142" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">Cellular / Sat NTN Link</text>
              <text x="22" y="158" fill={TOKEN_COLORS.faint} fontSize="9" fontFamily="monospace">LTE-M / NB-IoT / Satellite</text>
              <text x="22" y="170" fill={TOKEN_COLORS.faint} fontSize="8">Optional Cloud Sync Gateway</text>

              {/* High-Decibel Siren */}
              <rect x="14" y="192" width="197" height="62" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.critical} strokeWidth="1" rx="4" />
              <text x="22" y="214" fill={TOKEN_COLORS.critical} fontSize="11" fontWeight="600">110 dB Siren Horn</text>
              <text x="22" y="230" fill={TOKEN_COLORS.text} fontSize="9">Instant physical evacuation alarm</text>
              <text x="22" y="244" fill={TOKEN_COLORS.faint} fontSize="8">Audible 1.5 km radius</text>

              {/* LED Strobe & Speaker */}
              <rect x="14" y="266" width="197" height="58" fill={TOKEN_COLORS.surface} stroke={TOKEN_COLORS.line} rx="4" />
              <text x="22" y="288" fill={TOKEN_COLORS.text} fontSize="11" fontWeight="500">LED Strobe &amp; Voice Speaker</text>
              <text x="22" y="304" fill={TOKEN_COLORS.warn} fontSize="9" fontFamily="monospace">≤3 Hz Strobe + Local Dialect</text>
            </g>

            {/* Connecting Bus Lines */}
            <line x1="180" y1="180" x2="205" y2="180" stroke={TOKEN_COLORS.line} strokeWidth="2" strokeDasharray="3 3" />
            <line x1="405" y1="180" x2="430" y2="180" stroke={TOKEN_COLORS.accent} strokeWidth="2" />
            <line x1="670" y1="180" x2="695" y2="180" stroke={TOKEN_COLORS.accent} strokeWidth="2" />
          </svg>
        </div>
      </Panel>

      {/* Bill of Materials (BOM) Table */}
      <Panel
        title={`Bill of Materials: ${activeTab === "wildsentry" ? "WildSentry Node" : "HydroShield Node"}`}
        actions={
          <span className="text-xs text-muted font-mono">
            Total Est: <strong className="text-ok">₹{totalCost.toLocaleString("en-IN")}</strong>
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line text-faint uppercase font-mono">
                <th className="py-2.5 px-3 font-medium">Category</th>
                <th className="py-2.5 px-3 font-medium">Subsystem / Component</th>
                <th className="py-2.5 px-3 font-medium">Part Specification</th>
                <th className="py-2.5 px-3 font-medium">Functional Role</th>
                <th className="py-2.5 px-3 font-medium text-center">Qty</th>
                <th className="py-2.5 px-3 font-medium text-right">Est. Unit Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-text">
              {currentBOM.map((item) => (
                <tr key={item.id} className="hover:bg-surface-2 transition-colors duration-fast">
                  <td className="py-2.5 px-3 font-mono">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded-sm uppercase text-xs ${
                        item.category === "compute"
                          ? "bg-accent/10 text-accent"
                          : item.category === "sensing"
                          ? "bg-info/10 text-info"
                          : item.category === "power"
                          ? "bg-ok/10 text-ok"
                          : item.category === "comms"
                          ? "bg-warn/10 text-warn"
                          : item.category === "actuation"
                          ? "bg-critical/10 text-critical"
                          : "bg-surface-2 text-muted"
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium">{item.name}</td>
                  <td className="py-2.5 px-3 text-muted font-mono">{item.partSpec}</td>
                  <td className="py-2.5 px-3 text-muted leading-snug">{item.purpose}</td>
                  <td className="py-2.5 px-3 font-mono text-center">{item.qty}</td>
                  <td className="py-2.5 px-3 font-mono text-right text-text font-medium">
                    ₹{(item.estCostINR * item.qty).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-line bg-surface-2 font-mono">
                <td colSpan={5} className="py-3 px-3 text-right font-medium text-muted">
                  TOTAL ESTIMATED COST PER ASSEMBLED NODE:
                </td>
                <td className="py-3 px-3 text-right text-sm font-semibold text-ok">
                  ₹{totalCost.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-xs text-faint mt-3 flex items-center gap-1.5">
          <Info size={12} strokeWidth={1.5} />
          Note: Component costs are approximate INR estimates for 500+ unit fabrication runs. Actual component pricing varies with spot commodity markets and supplier volume discounts.
        </p>
      </Panel>

      {/* Qualcomm Edge AI Integration Callout */}
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
          <h2 className="text-base font-semibold text-text">
            Where Qualcomm Silicon Fits: Zero-Cloud On-Device Edge Intelligence
          </h2>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Traditional disaster warning systems rely on transmitting high-bandwidth raw sensor feeds or satellite imagery
          to remote cloud data centers. In remote Himalayan gorges and Brahmaputra floodplains, cellular connectivity
          regularly fails when power grids and cell towers go down during disasters.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-3 rounded-md bg-surface border border-line">
            <h3 className="text-xs font-medium text-accent mb-1">Qualcomm Hexagon™ NPU Inference</h3>
            <p className="text-xs text-faint leading-snug">
              Runs quantized 8-bit convolutional neural network (CNN) models directly on the node to recognize fire crackling acoustics and rate-of-rise surges in &lt;45ms.
            </p>
          </div>
          <div className="p-3 rounded-md bg-surface border border-line">
            <h3 className="text-xs font-medium text-accent mb-1">Ultra-Low-Power Wake-on-DSP</h3>
            <p className="text-xs text-faint leading-snug">
              Low-power DSP acoustic trigger keeps the SoC in deep microamp sleep until acoustic or vibration thresholds exceed baseline, allowing 7+ days of battery runtime.
            </p>
          </div>
          <div className="p-3 rounded-md bg-surface border border-line">
            <h3 className="text-xs font-medium text-accent mb-1">Sub-GHz LoRa Mesh Orchestration</h3>
            <p className="text-xs text-faint leading-snug">
              Instead of needing gigabytes of bandwidth, the node converts confirmed hazards into lightweight 32-byte encrypted mesh packets that hop node-to-node across mountains.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
