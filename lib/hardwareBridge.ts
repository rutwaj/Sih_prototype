/**
 * lib/hardwareBridge.ts
 * Hardware Event Adapter & Virtual Edge Sensor Bridge for ResiliNet-AI.
 * Connects physical/virtual ESP32 microcontroller edge sensors (DHT22, HC-SR04, Vibration/Tilt)
 * to ResiliNet's telemetry and hazard detection pipeline.
 */

import type { ScenarioId } from "@/data/messages";

export type HardwareHazardType = ScenarioId | "none";
export type HardwareSeverity = "ok" | "warn" | "critical";

export interface HardwareTelemetry {
  temperature: number; // °C (DHT22)
  humidity: number;    // % RH (DHT22)
  distance: number;    // cm (HC-SR04 ultrasonic clearance)
  vibration: number;   // g-force (Vibration/Tilt sensor SW-420/MPU)
  rawAdcSolar: number; // V (Solar ADC reading)
  batteryPct: number;  // %
}

export interface HardwareEvent {
  nodeId: string;
  nodeName: string;
  hazard: HardwareHazardType;
  temperature: number;
  humidity: number;
  distance: number;
  vibration: number;
  severity: HardwareSeverity;
  timestamp: string; // ISO timestamp

  // Edge processing metadata
  edgeDecision: string;
  localAlertFired: boolean;
  ledActive: boolean;
  buzzerActive: boolean;
  meshPacketStatus: "idle" | "transmitting" | "relayed" | "confirmed";
  causalStage: 1 | 2 | 3 | 4 | 5; // 1: Sensor -> 2: Edge Decision -> 3: Local Alert -> 4: Mesh Event -> 5: Dashboard
}

export interface PinState {
  pin: string;
  gpio: number;
  label: string;
  direction: "INPUT" | "OUTPUT" | "ANALOG" | "SPI";
  state: string;
  active: boolean;
}

export const NODE_CONFIG = {
  nodeId: "WS-001",
  nodeName: "Nainital Ridge North",
  region: "Uttarakhand",
  microcontroller: "ESP32-WROOM-32D (Dual-core 240MHz, 520KB SRAM)",
  loraTransceiver: "Semtech SX1262 (865-867 MHz IN865)",
  solarController: "MPPT CN3791 Solar Charger + LiFePO4 (12.8V 10Ah)",
};

export const BASELINE_TELEMETRY: HardwareTelemetry = {
  temperature: 24.5,
  humidity: 58.0,
  distance: 185.0,
  vibration: 0.04,
  rawAdcSolar: 3.3,
  batteryPct: 92,
};

export const FIRE_TELEMETRY: HardwareTelemetry = {
  temperature: 74.2,
  humidity: 14.0,
  distance: 182.0,
  vibration: 0.08,
  rawAdcSolar: 3.1,
  batteryPct: 88,
};

export const LANDSLIDE_TELEMETRY: HardwareTelemetry = {
  temperature: 21.0,
  humidity: 89.0,
  distance: 138.0,
  vibration: 7.85,
  rawAdcSolar: 1.8,
  batteryPct: 85,
};

export const FLOOD_TELEMETRY: HardwareTelemetry = {
  temperature: 19.5,
  humidity: 95.0,
  distance: 16.5,
  vibration: 0.12,
  rawAdcSolar: 1.2,
  batteryPct: 86,
};

/**
 * Evaluates raw sensor telemetry through quantized edge decision logic
 * and constructs a standardized typed HardwareEvent.
 */
export function evaluateHardwareTelemetry(
  telemetry: HardwareTelemetry,
  timestamp: string = new Date().toISOString()
): HardwareEvent {
  const { temperature, humidity, distance, vibration } = telemetry;

  // 1. Forest Fire: DHT22 temp threshold > 55°C or (temp > 48°C and humidity < 20%)
  if (temperature > 55 || (temperature > 48 && humidity < 20)) {
    return {
      nodeId: NODE_CONFIG.nodeId,
      nodeName: NODE_CONFIG.nodeName,
      hazard: "forest_fire",
      temperature,
      humidity,
      distance,
      vibration,
      severity: "critical",
      timestamp,
      edgeDecision: "DHT22 Thermal Anomaly Triggered (>55°C) — Thermal hot-spot & flame propagation verified.",
      localAlertFired: true,
      ledActive: true,
      buzzerActive: true,
      meshPacketStatus: "confirmed",
      causalStage: 5,
    };
  }

  // 2. Landslide: Vibration acceleration magnitude > 3.0g
  if (vibration > 3.0) {
    return {
      nodeId: NODE_CONFIG.nodeId,
      nodeName: NODE_CONFIG.nodeName,
      hazard: "landslide",
      temperature,
      humidity,
      distance,
      vibration,
      severity: "critical",
      timestamp,
      edgeDecision: "SW-420 High-G Acceleration Trip (>3.0g) — Slope displacement & acoustic slip verified.",
      localAlertFired: true,
      ledActive: true,
      buzzerActive: true,
      meshPacketStatus: "confirmed",
      causalStage: 5,
    };
  }

  // 3. Flash Flood: HC-SR04 ultrasonic clearance < 30 cm
  if (distance < 30) {
    return {
      nodeId: NODE_CONFIG.nodeId,
      nodeName: NODE_CONFIG.nodeName,
      hazard: "flash_flood",
      temperature,
      humidity,
      distance,
      vibration,
      severity: "critical",
      timestamp,
      edgeDecision: "HC-SR04 Ultrasonic Distance Below Clearance (<30cm) — Water level surge crest verified.",
      localAlertFired: true,
      ledActive: true,
      buzzerActive: true,
      meshPacketStatus: "confirmed",
      causalStage: 5,
    };
  }

  // Safe / Normal state
  return {
    nodeId: NODE_CONFIG.nodeId,
    nodeName: NODE_CONFIG.nodeName,
    hazard: "none",
    temperature,
    humidity,
    distance,
    vibration,
    severity: "ok",
    timestamp,
    edgeDecision: "All sensors within nominal operating safety envelope. No threshold breach.",
    localAlertFired: false,
    ledActive: false,
    buzzerActive: false,
    meshPacketStatus: "idle",
    causalStage: 1,
  };
}

/**
 * Returns the active GPIO pin states for the virtual ESP32 board
 */
export function getBoardPinStates(event: HardwareEvent): PinState[] {
  return [
    {
      pin: "D4",
      gpio: 4,
      label: "DHT22 DATA (Temp/Humidity)",
      direction: "INPUT",
      state: `${event.temperature.toFixed(1)}°C / ${event.humidity.toFixed(0)}%`,
      active: event.hazard === "forest_fire",
    },
    {
      pin: "D5",
      gpio: 5,
      label: "HC-SR04 TRIG (Ultrasonic)",
      direction: "OUTPUT",
      state: "10µs PULSE",
      active: true,
    },
    {
      pin: "D18",
      gpio: 18,
      label: "HC-SR04 ECHO (Ultrasonic)",
      direction: "INPUT",
      state: `${event.distance.toFixed(1)} cm`,
      active: event.hazard === "flash_flood",
    },
    {
      pin: "D19",
      gpio: 19,
      label: "VIBRATION SENSOR (SW-420)",
      direction: "INPUT",
      state: `${event.vibration.toFixed(2)} g`,
      active: event.hazard === "landslide",
    },
    {
      pin: "D2",
      gpio: 2,
      label: "RED ALARM LED",
      direction: "OUTPUT",
      state: event.ledActive ? "HIGH (ON)" : "LOW (OFF)",
      active: event.ledActive,
    },
    {
      pin: "D23",
      gpio: 23,
      label: "PIEZO BUZZER (85dB)",
      direction: "OUTPUT",
      state: event.buzzerActive ? "PWM 2.7kHz (ACTIVE)" : "SILENT",
      active: event.buzzerActive,
    },
    {
      pin: "D34",
      gpio: 34,
      label: "SOLAR ADC / BATTERY",
      direction: "ANALOG",
      state: "3.3V (NOMINAL)",
      active: false,
    },
    {
      pin: "SPI",
      gpio: 5,
      label: "SX1262 LoRa NSS/SCK/MISO/MOSI",
      direction: "SPI",
      state: event.meshPacketStatus === "confirmed" ? "TX 865MHz +22dBm" : "RX LISTEN",
      active: event.meshPacketStatus === "confirmed",
    },
  ];
}
