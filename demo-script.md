# ResiliNet-AI: 90-Second Judge Presentation & Walkthrough Script

> **Problem Statement 26178 (Qualcomm)**: AI-Powered Environmental Monitoring Network for Disaster Management  
> **Team ResiliNet-AI** — Smart India Hackathon 2026

---

## ⏱️ Section 1: The Hook & Core Problem (0:00 – 0:20)

> *"Judges, during severe flash floods, landslides, or forest fires, two critical failures always occur simultaneously:*
> 1. *Power grids and cell towers go down, cutting off cellular communications.*
> 2. *Centralized satellite warning pipelines take between 45 minutes to 3 hours to process and deliver bulletins — far too late for mountain villages.*
>
> *ResiliNet-AI solves this with solar-powered, offline edge AI nodes connected in a decentralized LoRa mesh that detect disasters on-device and trigger inclusive local physical alarms in under 4 seconds — even during total electrical blackout and network collapse."*

---

## ⏱️ Section 2: Live Demo on Map (0:20 – 0:50)

**Action**: Open `http://localhost:3000` on the **Live Map**.

1. **Top Bar Audio**: Click **"Enable sound"** in the top bar.
2. **Trigger Disaster**: Click **"Forest Fire"** in the right control panel.
3. **Point out the Live Flow**:
   - **t = 0.5s**: Acoustic anomaly detected on node `WS-001` (Nainital Ridge) via MEMS microphone (78 dB).
   - **t = 1.2s**: On-device Qualcomm Hexagon NPU verifies thermal anomaly (68 °C canopy).
   - **t = 2.5s**: Hazard confirmed with 94% local confidence.
   - **t = 2.6s**: Local 110 dB siren horn and flashing strobe beacon activate immediately.
   - **t = 3.5s**: Sub-GHz LoRa mesh propagates the alert node-to-node across Uttarakhand hill nodes (`WS-002`, `WS-003`, `WS-004`).
   - **Inclusive Audio & Contacts**: Show the multi-lingual voice broadcast (switching between **English**, **हिंदी**, and **தமிழ்**) and automated dispatch log to the local Sarpanch, School, and Health Centre.

---

## ⏱️ Section 3: Stress-Test & Synchronized Comparison (0:50 – 1:15)

**Action**: Navigate to the **Compare View** (`/compare`).

1. **Point to the Two Pipelines**:
   - Left: **ResiliNet-AI** (3.4 seconds total response time).
   - Right: **Legacy Satellite/Cloud Pipeline** (~180 minutes).
2. **Flip the "Grid down + Tower down" Toggle**:
   - Show how the legacy pipeline experiences catastrophic failure because mobile towers are unpowered.
   - ResiliNet-AI continues operating 100% autonomously on its 128Wh LiFePO4 solar battery buffer and offline LoRa mesh.

---

## ⏱️ Section 4: Hardware BOM & Scalability (1:15 – 1:30)

**Action**: Navigate to the **Hardware View** (`/hardware`).

1. **Cost & Scalability**:
   - ResiliNet node BOM cost: **~₹14,800 / node** (~97% cheaper than traditional ₹5.5 Lakh telemetry towers).
   - Enables high-density spatial deployment across vulnerable Himalayan and Northeast river catchments.
2. **Qualcomm Edge Silicon Placement**:
   - Qualcomm Edge AI SoC provides on-device quantized neural inference, low-power acoustic wake-up DSP, and sub-GHz mesh routing with zero recurring cloud API costs.

---

## 💡 Quick Judge Q&A Cheat Sheet

- **Q: What happens if a node is destroyed by fire or rockfall?**  
  *A: The LoRa mesh uses dynamic BFS multi-path routing. If any node fails, neighboring nodes immediately re-route packets along alternate hops.*
- **Q: How does flood prediction work?**  
  *A: It uses non-contact 24 GHz radar rate-of-rise trend extrapolation combined with upstream node chaining, giving downstream settlements 25+ minutes of lead time before water surge arrives.*
- **Q: How long does the battery last without sun?**  
  *A: The 12.8V 10–12Ah LiFePO4 battery pack provides 7+ days of continuous operation with zero sunlight.*
