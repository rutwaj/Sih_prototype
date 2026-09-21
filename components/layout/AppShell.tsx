"use client";

import React from "react";
import LeftRail from "./LeftRail";
import TopBar from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell — the persistent chrome around every page.
 *
 * Layout:
 *   ┌─────────────────────────────────────────┐
 *   │             TopBar (48px)               │
 *   ├──────────┬──────────────────────────────┤
 *   │ LeftRail │       Main Content           │
 *   │ (48px)   │                              │
 *   └──────────┴──────────────────────────────┘
 */
export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg text-text">
      {/* Top bar — fixed height 48px */}
      <TopBar />

      {/* Below top bar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left rail — fixed width 48px */}
        <LeftRail />

        {/* Main content area — fills remaining space */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
