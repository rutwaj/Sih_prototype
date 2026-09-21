"use client";

/**
 * components/alerts/AlertPanel.tsx
 * Phase 5: Alert Experience — overlaid over the map when an activeAlert exists.
 *
 * Shows:
 *  - Detection timeline (sound → thermal → confirmed + confidence %)
 *  - Siren indicator (animated when active)
 *  - Flashing light indicator (CSS animation, ≤3 Hz, reduced-motion safe)
 *  - Voice message with live captions
 *  - Mock call/WhatsApp log with delivery states
 */

import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX, Phone, MessageSquare, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSimStore } from "@/store/simStore";
import { getContactsByRegion } from "@/data/contacts";
import { getMessagesForScenario, fillTemplate } from "@/data/messages";
import Badge from "@/components/ui/Badge";
import {
  startSiren,
  stopSiren,
  setSirenMuted,
  playClip,
  stopClip,
  clipPath,
  langToBcp47,
} from "@/lib/audio";
import type { ScenarioId } from "@/data/messages";
import type { DeliveryState } from "@/data/contacts";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MockMessageLog {
  id: string;
  contactId: string;
  contactName: string;
  channel: "call" | "whatsapp";
  state: DeliveryState;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AlertPanel() {
  const activeAlert = useSimStore((s) => s.activeAlert);
  const events = useSimStore((s) => s.events);
  const muted = useSimStore((s) => s.muted);
  const soundEnabled = useSimStore((s) => s.soundEnabled);
  const setActiveAlert = useSimStore((s) => s.setActiveAlert);

  const [activeLang, setActiveLang] = useState<string>("en");
  const [messageLogs, setMessageLogs] = useState<MockMessageLog[]>([]);
  const sirenStarted = useRef(false);
  const clipStarted = useRef(false);

  const isConfirmed =
    activeAlert?.phase === "confirmed" || activeAlert?.phase === "propagating";

  // Get the origin node from the store
  const nodes = useSimStore((s) => s.nodes);
  const originNode = activeAlert
    ? nodes.find((n) => n.id === activeAlert.affectedNodeIds[0])
    : null;

  // When alert is confirmed: start siren + mock messages
  useEffect(() => {
    if (!isConfirmed || !activeAlert) return;

    // Start siren
    if (!sirenStarted.current && soundEnabled) {
      startSiren(muted);
      sirenStarted.current = true;
    }

    // Play voice clip
    if (!clipStarted.current && soundEnabled && !muted && originNode) {
      const scenarioId = activeAlert.scenarioId as ScenarioId;
      const path = clipPath(scenarioId, activeLang);
      const messages = getMessagesForScenario(scenarioId);
      const msg = messages.find((m) => m.lang === activeLang) ?? messages[0];
      if (msg) {
        const filledText = fillTemplate(msg.voice, {
          node: originNode.name,
          shelter: "nearest safe area",
          village: originNode.region,
          rise: "6",
        });
        playClip(path, filledText, langToBcp47(activeLang), muted);
        clipStarted.current = true;
      }
    }

    // Build mock message logs
    if (messageLogs.length === 0 && originNode) {
      const contacts = getContactsByRegion(originNode.region);
      const logs: MockMessageLog[] = contacts.flatMap((c) => [
        { id: `${c.id}-call`, contactId: c.id, contactName: c.name, channel: "call" as const, state: "pending" },
        { id: `${c.id}-wa`, contactId: c.id, contactName: c.name, channel: "whatsapp" as const, state: "pending" },
      ]);
      setMessageLogs(logs);

      // Simulate delivery states with delays
      logs.forEach((log, i) => {
        setTimeout(() => {
          setMessageLogs((prev) =>
            prev.map((l) => l.id === log.id ? { ...l, state: "sent" } : l)
          );
        }, 800 + i * 300);
        setTimeout(() => {
          setMessageLogs((prev) =>
            prev.map((l) => l.id === log.id ? { ...l, state: "delivered" } : l)
          );
        }, 2000 + i * 400);
      });
    }
  }, [isConfirmed, activeAlert, soundEnabled, muted, activeLang, messageLogs.length, originNode]);

  // Sync mute with siren
  useEffect(() => {
    setSirenMuted(muted);
  }, [muted]);

  // Stop audio on dismiss
  const handleDismiss = () => {
    stopSiren();
    stopClip();
    sirenStarted.current = false;
    clipStarted.current = false;
    setMessageLogs([]);
    setActiveAlert(null);
  };

  if (!activeAlert) return null;

  const scenarioId = activeAlert.scenarioId as ScenarioId;
  const alertMessages = getMessagesForScenario(scenarioId);
  const activeMessage = alertMessages.find((m) => m.lang === activeLang) ?? alertMessages[0];

  const nodeForTemplate = originNode?.name ?? activeAlert.affectedNodeIds[0];
  const caption = activeMessage
    ? fillTemplate(activeMessage.caption, {
        node: nodeForTemplate,
        shelter: "nearest safe area",
        village: originNode?.region ?? "",
        rise: "6",
      })
    : "";

  // Events for the detection timeline
  const timelineEvents = events
    .filter(
      (e) =>
        e.nodeId === activeAlert.affectedNodeIds[0] &&
        (e.type === "sensor_anomaly" || e.type === "sensor_confirmed" || e.type === "alert_sent")
    )
    .slice(0, 5)
    .reverse();

  return (
    <AnimatePresence>
      <motion.div
        key="alert-panel"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
        className="absolute bottom-4 right-4 z-[1100] w-80 bg-surface border border-line rounded-lg overflow-hidden"
      >
        {/* Header */}
        <div
          className={`flex items-center gap-2 px-4 py-3 border-b border-line ${
            isConfirmed ? "bg-critical" : "bg-warn"
          } bg-opacity-10`}
        >
          <AlertTriangle
            size={14}
            strokeWidth={1.5}
            className={isConfirmed ? "text-critical" : "text-warn"}
          />
          <span className={`flex-1 text-sm font-medium ${isConfirmed ? "text-critical" : "text-warn"}`}>
            {isConfirmed
              ? "CONFIRMED ALERT"
              : activeAlert.phase === "detecting"
              ? "Detecting…"
              : "Verifying…"}
          </span>
          {isConfirmed && (
            <span className="font-mono text-xs text-critical">{activeAlert.confidence}%</span>
          )}
          <button
            onClick={handleDismiss}
            className="flex items-center justify-center w-6 h-6 rounded-sm text-faint hover:text-text hover:bg-surface-2 transition-colors duration-fast"
            aria-label="Dismiss alert"
          >
            <X size={12} strokeWidth={1.5} />
          </button>
        </div>

        {/* Siren + Light indicators */}
        {isConfirmed && (
          <div className="flex items-center gap-3 px-4 py-2 border-b border-line bg-surface-2">
            {/* Siren indicator */}
            <div className="flex items-center gap-1.5">
              <motion.div
                className="w-2 h-2 rounded-full bg-critical"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-xs text-muted">Siren</span>
            </div>
            {/* Strobe light indicator — max 3 Hz = min 333ms period */}
            <div className="flex items-center gap-1.5">
              <motion.div
                className="w-2 h-2 rounded-full bg-warn"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-xs text-muted">Strobe</span>
            </div>
            <div className="flex-1" />
            {/* Sound toggle */}
            <button
              className="flex items-center justify-center w-6 h-6 rounded-sm text-faint hover:text-text hover:bg-surface transition-colors duration-fast"
              onClick={() => {
                const { muted: m, setMuted } = useSimStore.getState();
                setMuted(!m);
              }}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX size={12} strokeWidth={1.5} /> : <Volume2 size={12} strokeWidth={1.5} />}
            </button>
          </div>
        )}

        {/* Detection timeline */}
        <div className="px-4 py-3 border-b border-line">
          <p className="text-xs text-faint uppercase tracking-wide mb-2">Detection sequence</p>
          {timelineEvents.length === 0 ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-info"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span className="text-xs text-muted">Initialising sensors…</span>
            </div>
          ) : (
            <ol className="space-y-1.5">
              {timelineEvents.map((e) => (
                <li key={e.id} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0">
                    {e.type === "sensor_confirmed" ? (
                      <CheckCircle2 size={11} strokeWidth={1.5} className="text-critical" />
                    ) : e.type === "alert_sent" ? (
                      <CheckCircle2 size={11} strokeWidth={1.5} className="text-ok" />
                    ) : (
                      <Clock size={11} strokeWidth={1.5} className="text-warn" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text leading-snug line-clamp-2">{e.message}</p>
                  </div>
                  <span className="text-xs font-mono text-faint flex-shrink-0">
                    {new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Voice captions */}
        {isConfirmed && activeMessage && (
          <div className="px-4 py-3 border-b border-line">
            {/* Language tabs */}
            <div className="flex gap-1 mb-2">
              {alertMessages.map((m) => (
                <button
                  key={m.lang}
                  onClick={() => {
                    setActiveLang(m.lang);
                    clipStarted.current = false; // allow replay in new lang
                  }}
                  className={[
                    "px-2 py-0.5 rounded-sm text-xs font-mono transition-colors duration-fast",
                    activeLang === m.lang
                      ? "bg-accent text-bg"
                      : "text-muted hover:text-text hover:bg-surface-2",
                  ].join(" ")}
                >
                  {m.langLabel}
                </button>
              ))}
            </div>
            {/* Caption */}
            <p className="text-xs text-text leading-relaxed">{caption}</p>
          </div>
        )}

        {/* Mock call/WhatsApp log */}
        {isConfirmed && messageLogs.length > 0 && (
          <div className="px-4 py-3 max-h-40 overflow-y-auto">
            <p className="text-xs text-faint uppercase tracking-wide mb-2">Alert dispatch log</p>
            <ol className="space-y-1">
              {messageLogs.map((log) => (
                <li key={log.id} className="flex items-center gap-2">
                  {log.channel === "call" ? (
                    <Phone size={10} strokeWidth={1.5} className="text-faint flex-shrink-0" />
                  ) : (
                    <MessageSquare size={10} strokeWidth={1.5} className="text-faint flex-shrink-0" />
                  )}
                  <span className="text-xs text-muted flex-1 truncate">{log.contactName}</span>
                  <DeliveryBadge state={log.state} />
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Mesh propagation count */}
        {activeAlert.affectedNodeIds.length > 1 && (
          <div className="px-4 py-2 border-t border-line flex items-center gap-2">
            <Badge status="info" label={`${activeAlert.affectedNodeIds.length - 1} node${activeAlert.affectedNodeIds.length > 2 ? "s" : ""} alerted via mesh`} size="sm" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function DeliveryBadge({ state }: { state: DeliveryState }) {
  switch (state) {
    case "pending":
      return (
        <motion.span
          className="text-xs font-mono text-faint"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          sending…
        </motion.span>
      );
    case "sent":
      return <span className="text-xs font-mono text-info">sent</span>;
    case "delivered":
      return <span className="text-xs font-mono text-ok">delivered</span>;
    case "failed":
      return <span className="text-xs font-mono text-critical">failed</span>;
  }
}
