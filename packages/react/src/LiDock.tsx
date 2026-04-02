import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useContext,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  BaseToolContract,
  createDockRuntime,
  DockConfigInput,
  DockPosition,
  DockRuntime,
  RuntimeState,
} from '@lidock/core';

const LIQUIDOCK_STYLES = `
  .liquidock-root, .liquidock-root * { box-sizing: border-box; }
  @keyframes liquidock-sheen {
    0%, 100% { transform: translate3d(-2%, 0, 0) scale(1); opacity: 0.68; }
    50% { transform: translate3d(3%, -2%, 0) scale(1.03); opacity: 1; }
  }
  @keyframes liquidock-pool {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(0, -4%, 0) scale(1.08); }
  }
  .liquidock-layer {
    --ld-glass-highlight: rgba(150, 198, 255, 1);
    --ld-glass-highlight-soft: rgba(150, 198, 255, 0.12);
    --ld-glass-panel: rgba(9, 14, 22, 0.84);
    --ld-glass-panel-strong: rgba(8, 13, 21, 0.88);
    position: fixed;
    z-index: 2147483000;
    display: flex;
    pointer-events: none;
  }
  .liquidock-layer[data-edge="top"],
  .liquidock-layer[data-edge="bottom"] {
    flex-direction: column;
    align-items: center;
  }
  .liquidock-layer[data-edge="left"],
  .liquidock-layer[data-edge="right"] {
    flex-direction: row;
    align-items: center;
  }
  .liquidock-layer[data-edge="top"] {
    flex-direction: column-reverse;
  }
  .liquidock-layer[data-edge="right"] {
    flex-direction: row-reverse;
  }
  .liquidock-caption {
    margin-bottom: 10px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(7, 12, 18, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(245, 248, 251, 0.84);
    font: 600 11px/1.2 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    backdrop-filter: blur(18px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
  }
  .liquidock-frame {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--ld-item-gap);
    min-height: calc(var(--ld-item-size) + (var(--ld-frame-padding) * 2) + 4px);
    padding: var(--ld-frame-padding);
    border-radius: var(--ld-frame-radius);
    border: 1px solid rgba(255, 255, 255, calc(var(--ld-frame-border-opacity) * (0.68 + (var(--ld-shell-engaged) * 0.36))));
    background:
      linear-gradient(180deg, rgba(38, 44, 54, calc(0.28 + (var(--ld-shell-active) * 0.04) + (var(--ld-shell-engaged) * 0.04))) 0%, rgba(18, 21, 27, calc(0.22 + (var(--ld-shell-active) * 0.03) + (var(--ld-shell-engaged) * 0.03))) 100%),
      radial-gradient(circle at 20% 16%, rgba(255, 255, 255, calc(0.12 + (var(--ld-shell-engaged) * 0.04))), transparent 38%),
      radial-gradient(circle at 82% 82%, rgba(170, 188, 210, calc(0.05 + (var(--ld-shell-engaged) * 0.03))), transparent 34%),
      rgba(9, 14, 22, var(--ld-frame-opacity));
    backdrop-filter: blur(var(--ld-frame-blur));
    box-shadow:
      0 14px 28px rgba(0, 0, 0, calc(0.18 + (var(--ld-shell-engaged) * 0.04))),
      0 0 0 calc(var(--ld-frame-glow) * 10px) rgba(150, 198, 255, calc(var(--ld-frame-glow) * (0.04 + (var(--ld-shell-engaged) * 0.05)))),
      inset 0 1px 0 rgba(255, 255, 255, calc(0.1 + (var(--ld-shell-engaged) * 0.02))),
      inset 0 -14px 24px rgba(5, 7, 10, calc(0.12 + (var(--ld-shell-engaged) * 0.02)));
    pointer-events: auto;
    overflow: visible;
    isolation: isolate;
    transition:
      background var(--ld-motion-duration) var(--ld-motion-easing),
      border-color var(--ld-motion-duration) var(--ld-motion-easing),
      box-shadow var(--ld-motion-duration) var(--ld-motion-easing);
  }
  .liquidock-frame[data-orientation="vertical"] {
    flex-direction: column;
  }
  .liquidock-frame::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: calc(var(--ld-frame-radius) - 1px);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 42%, rgba(255,255,255,0.01) 100%),
      radial-gradient(circle at 16% 12%, rgba(255,255,255,0.12), transparent 36%);
    opacity: calc(0.58 + (var(--ld-shell-engaged) * 0.14));
    mix-blend-mode: screen;
    pointer-events: none;
    animation: liquidock-sheen 14s ease-in-out infinite;
  }
  .liquidock-frame::after {
    content: "";
    position: absolute;
    inset: 44% 8% 8%;
    border-radius: 999px;
    background: radial-gradient(circle at 50% 50%, rgba(180,198,220,0.14), rgba(180,198,220,0) 72%);
    opacity: calc(0.12 + (var(--ld-shell-engaged) * 0.06));
    filter: blur(14px);
    pointer-events: none;
    animation: liquidock-pool 10.4s ease-in-out infinite;
  }
  .liquidock-handle {
    width: 24px;
    min-width: 24px;
    height: var(--ld-item-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 0;
    border-radius: 14px;
    background: transparent;
    cursor: grab;
    opacity: 1;
    touch-action: none;
    user-select: none;
  }
  .liquidock-frame[data-orientation="vertical"] .liquidock-handle {
    width: var(--ld-item-size);
    min-width: 0;
    height: 24px;
  }
  .liquidock-handle:active {
    cursor: grabbing;
  }
  .liquidock-handle-dots {
    display: grid;
    grid-template-columns: repeat(2, 4px);
    gap: 4px;
  }
  .liquidock-frame[data-orientation="vertical"] .liquidock-handle-dots {
    grid-template-columns: repeat(3, 4px);
    grid-template-rows: repeat(2, 4px);
  }
  .liquidock-handle-dot {
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: rgba(255,255,255, calc(0.22 + (var(--ld-shell-engaged) * 0.22)));
    transition: background var(--ld-motion-duration) var(--ld-motion-easing);
  }
  .liquidock-items {
    display: flex;
    align-items: center;
    gap: var(--ld-item-gap);
    position: relative;
    z-index: 1;
  }
  .liquidock-items[data-orientation="vertical"] {
    flex-direction: column;
  }
  .liquidock-item {
    position: relative;
    width: var(--ld-item-width, var(--ld-item-size));
    min-width: var(--ld-item-size);
    height: var(--ld-item-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding-block: var(--ld-item-padding);
    padding-inline: var(--ld-item-inline-padding, var(--ld-item-padding));
    border: 1px solid rgba(255, 255, 255, calc(0.08 + (var(--ld-item-engaged) * 0.04)));
    border-radius: var(--ld-item-radius);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, calc(0.07 + (var(--ld-item-engaged) * 0.02))) 0%, rgba(255, 255, 255, calc(0.025 + (var(--ld-item-engaged) * 0.005))) 100%),
      radial-gradient(circle at 22% 20%, rgba(255,255,255, calc(0.08 + (var(--ld-item-engaged) * 0.03))), transparent 40%),
      radial-gradient(circle at 80% 84%, rgba(172,192,214, calc(0.04 + (var(--ld-item-engaged) * 0.02))), transparent 36%),
      rgba(12, 18, 28, 0.88);
    color: rgba(247, 250, 252, 0.92);
    transform: translateY(var(--ld-item-lift)) scale(var(--ld-item-scale));
    transition:
      transform var(--ld-motion-duration) var(--ld-motion-easing),
      background var(--ld-motion-duration) var(--ld-motion-easing),
      border-color var(--ld-motion-duration) var(--ld-motion-easing),
      box-shadow var(--ld-motion-duration) var(--ld-motion-easing),
      width var(--ld-motion-duration) var(--ld-motion-easing),
      padding var(--ld-motion-duration) var(--ld-motion-easing);
    box-shadow:
      0 6px 14px rgba(0, 0, 0, calc(0.08 + (var(--ld-item-engaged) * 0.04))),
      inset 0 1px 0 rgba(255, 255, 255, calc(0.07 + (var(--ld-item-engaged) * 0.03))),
      inset 0 -10px 18px rgba(6, 8, 12, calc(0.08 + (var(--ld-item-engaged) * 0.02)));
    cursor: pointer;
    outline: none;
    overflow: hidden;
    isolation: isolate;
  }
  .liquidock-frame[data-orientation="vertical"] .liquidock-item {
    transform: translateX(var(--ld-item-lift)) scale(var(--ld-item-scale));
  }
  .liquidock-item::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: calc(var(--ld-item-radius) - 1px);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 44%, rgba(255,255,255,0.01) 100%),
      radial-gradient(circle at 22% 18%, rgba(255,255,255,0.1), transparent 34%);
    opacity: calc(0.58 + (var(--ld-item-engaged) * 0.14));
    mix-blend-mode: screen;
    pointer-events: none;
    animation: liquidock-sheen 11s ease-in-out infinite;
  }
  .liquidock-item::after {
    content: "";
    position: absolute;
    inset: 48% 14% 8%;
    border-radius: 999px;
    background: radial-gradient(circle at 50% 50%, rgba(180,198,220,0.14), rgba(180,198,220,0) 72%);
    opacity: calc(0.1 + (var(--ld-item-engaged) * 0.08));
    filter: blur(10px);
    pointer-events: none;
    animation: liquidock-pool 8.8s ease-in-out infinite;
  }
  .liquidock-item[data-active="true"] {
    border-color: rgba(150, 198, 255, 0.26);
    box-shadow:
      0 8px 18px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(150, 198, 255, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  .liquidock-item:hover {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.03)),
      radial-gradient(circle at 22% 18%, rgba(255,255,255,0.11), transparent 42%),
      radial-gradient(circle at 80% 84%, rgba(176,196,220,0.06), transparent 38%),
      rgba(12, 18, 28, 0.9);
  }
  .liquidock-item-content {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    min-width: 0;
    width: 100%;
  }
  .liquidock-item-icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--ld-item-size) - (var(--ld-item-padding) * 2));
    min-width: calc(var(--ld-item-size) - (var(--ld-item-padding) * 2));
    transition:
      opacity var(--ld-motion-duration) ease,
      transform var(--ld-motion-duration) var(--ld-motion-easing);
  }
  .liquidock-item-icon {
    font: 600 18px/1 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    text-transform: uppercase;
  }
  .liquidock-item-label {
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    white-space: nowrap;
    font: 600 11px/1 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    letter-spacing: -0.01em;
    color: rgba(255,255,255,0.82);
    transform: translate3d(-8px, 0, 0);
    transform-origin: left center;
    transition:
      max-width var(--ld-motion-duration) var(--ld-motion-easing),
      opacity var(--ld-motion-duration) ease,
      transform var(--ld-motion-duration) var(--ld-motion-easing),
      margin-left var(--ld-motion-duration) var(--ld-motion-easing);
  }
  .liquidock-item[data-inline-label="true"] {
    justify-content: flex-start;
  }
  .liquidock-item[data-inline-label="true"] .liquidock-item-icon-wrap {
    opacity: 0;
    transform: translate3d(-6px, 0, 0) scale(0.94);
  }
  .liquidock-item[data-inline-label="true"] .liquidock-item-label {
    max-width: calc(var(--ld-item-width) - var(--ld-item-size) + 24px);
    opacity: 1;
    margin-left: -4px;
    transform: translate3d(0, 0, 0);
  }
  .liquidock-surface {
    width: min(var(--ld-surface-width), calc(100vw - 24px));
    max-height: min(var(--ld-surface-max-height), calc(100vh - 120px));
    margin-bottom: 12px;
    overflow: hidden;
    border-radius: var(--ld-surface-radius);
    border: 1px solid rgba(255, 255, 255, 0.1);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02)),
      radial-gradient(circle at 50% 0%, rgba(150, 198, 255, 0.08), transparent 70%),
      rgba(8, 13, 21, var(--ld-surface-opacity));
    backdrop-filter: blur(var(--ld-surface-blur));
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    pointer-events: auto;
  }
  .liquidock-layer[data-edge="top"] .liquidock-surface {
    margin-top: 12px;
    margin-bottom: 0;
  }
  .liquidock-layer[data-edge="left"] .liquidock-surface,
  .liquidock-layer[data-edge="right"] .liquidock-surface {
    margin-bottom: 0;
    margin-right: 12px;
  }
  .liquidock-layer[data-edge="right"] .liquidock-surface {
    margin-left: 12px;
    margin-right: 0;
  }
  .liquidock-surface-header,
  .liquidock-surface-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: var(--ld-surface-padding);
  }
  .liquidock-surface-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .liquidock-surface-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }
  .liquidock-surface-kicker {
    font: 600 11px/1.2 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    color: rgba(214, 224, 235, 0.56);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .liquidock-surface-title {
    margin-top: 8px;
    font: 600 18px/1.2 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    color: rgba(247, 250, 252, 0.94);
  }
  .liquidock-surface-summary {
    margin-top: 8px;
    color: rgba(214, 222, 232, 0.68);
    font: 500 12px/1.5 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
  }
  .liquidock-surface-body {
    display: grid;
    gap: 12px;
    padding: 0 var(--ld-surface-padding) var(--ld-surface-padding);
  }
  .liquidock-search,
  .liquidock-draft {
    width: 100%;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(245, 248, 251, 0.9);
    outline: none;
  }
  .liquidock-search {
    padding: 12px 14px;
  }
  .liquidock-draft {
    min-height: 112px;
    resize: vertical;
    padding: 14px;
  }
  .liquidock-surface-list {
    display: grid;
    gap: 8px;
  }
  .liquidock-surface-item {
    width: 100%;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
    padding: 12px 14px;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    color: inherit;
    cursor: pointer;
  }
  .liquidock-surface-item[data-active="true"] {
    border-color: rgba(150, 198, 255, 0.24);
    background: rgba(150, 198, 255, 0.08);
  }
  .liquidock-surface-item-mark {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: rgba(150, 198, 255, 0.12);
    font: 700 11px/1 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    text-transform: uppercase;
  }
  .liquidock-surface-item-title {
    font: 600 13px/1.2 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
  }
  .liquidock-surface-item-note {
    margin-top: 4px;
    color: rgba(209, 218, 227, 0.62);
    font: 500 12px/1.45 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
  }
  .liquidock-surface-item-meta {
    padding: 6px 8px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.05);
    color: rgba(244, 247, 251, 0.72);
    font: 600 10px/1 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .liquidock-draft-label {
    font: 600 11px/1.2 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    color: rgba(214, 224, 235, 0.56);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .liquidock-surface-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .liquidock-button {
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255,255,255,0.06);
    color: rgba(246, 248, 251, 0.86);
    cursor: pointer;
  }
  .liquidock-button[data-kind="primary"] {
    background: rgba(150, 198, 255, 0.1);
    border-color: rgba(150, 198, 255, 0.22);
  }
  .liquidock-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147482990;
    pointer-events: auto;
    background:
      linear-gradient(180deg, rgba(3, 8, 14, 0.22), rgba(3, 8, 14, 0.36)),
      radial-gradient(circle at var(--ld-overlay-cursor-x) var(--ld-overlay-cursor-y), rgba(150, 198, 255, 0.14), transparent 22%);
  }
  .liquidock-overlay::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 44px 44px;
    opacity: 0.22;
    pointer-events: none;
  }
  .liquidock-overlay-bar,
  .liquidock-overlay-footer {
    position: absolute;
    left: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(8, 13, 21, 0.72);
    backdrop-filter: blur(22px);
    box-shadow: 0 14px 30px rgba(0,0,0,0.18);
  }
  .liquidock-overlay-bar { top: 24px; }
  .liquidock-overlay-footer { bottom: 24px; }
  .liquidock-overlay-title {
    font: 600 16px/1.2 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    color: rgba(246, 249, 252, 0.92);
  }
  .liquidock-overlay-summary {
    margin-top: 6px;
    font: 500 12px/1.4 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    color: rgba(209, 218, 227, 0.68);
  }
  .liquidock-overlay-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .liquidock-overlay-chip {
    padding: 9px 12px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: rgba(241,245,249,0.78);
    cursor: pointer;
  }
  .liquidock-overlay-chip[data-active="true"] {
    background: rgba(150, 198, 255, 0.1);
    border-color: rgba(150, 198, 255, 0.22);
  }
  .liquidock-overlay-cursor {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    font: 600 11px/1 "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    color: rgba(241,245,249,0.72);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
`;

const ICONS: Record<string, string> = {
  home: '⌂',
  github: 'GH',
  x: 'X',
  youtube: 'YT',
  share: '↗',
  mail: '✉',
  pencil: '✎',
};

type ToolWorkspaceState = {
  query: string;
  selectedItemId?: string;
  draft: string;
  lastAction?: string;
};

type OverlayWorkspaceState = {
  cursorX: number;
  cursorY: number;
  controls: Record<string, boolean>;
};

type DragState = {
  pointerId: number;
  origin: DockPosition;
  startX: number;
  startY: number;
};

export const LiDockContext = createContext<DockRuntime | null>(null);

export interface LiDockProviderProps {
  children?: ReactNode;
  runtime?: DockRuntime;
  config?: DockConfigInput;
  tools?: BaseToolContract[];
}

export interface LiDockDockProps {
  className?: string;
  style?: CSSProperties;
  onAction?: (tool: BaseToolContract, runtime: DockRuntime) => void;
}

export interface LiDockProps extends LiDockProviderProps, LiDockDockProps {}

function useDockRuntimeState(): RuntimeState {
  const runtime = useContext(LiDockContext);

  if (!runtime) {
    throw new Error('LiDock components must be used within a LiDockProvider');
  }

  return useSyncExternalStore(runtime.subscribe, runtime.getState, runtime.getState);
}

function useDockRuntime(): DockRuntime {
  const runtime = useContext(LiDockContext);

  if (!runtime) {
    throw new Error('LiDock components must be used within a LiDockProvider');
  }

  return runtime;
}

function iconForTool(tool: BaseToolContract) {
  if (tool.trigger.icon && ICONS[tool.trigger.icon]) {
    return ICONS[tool.trigger.icon];
  }

  if (tool.trigger.icon) {
    return tool.trigger.icon.slice(0, 2).toUpperCase();
  }

  return tool.trigger.label.slice(0, 2).toUpperCase();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDockLabelWidth(label: string, itemSize: number) {
  return Math.max(itemSize, Math.min(188, label.length * 9 + 24));
}

function clampDockPosition(position: DockPosition, shell: HTMLDivElement) {
  const rect = shell.getBoundingClientRect();

  return {
    x: Math.round(clamp(position.x, 12, Math.max(12, window.innerWidth - rect.width - 12))),
    y: Math.round(clamp(position.y, 12, Math.max(12, window.innerHeight - rect.height - 12))),
  };
}

function getDefaultPlacementStyle(state: RuntimeState): CSSProperties {
  const { positioning } = state.dock.config;
  const style: CSSProperties = {};

  if (positioning.edge === 'bottom') {
    style.bottom = `${positioning.inset}px`;
    if (positioning.align === 'center') {
      style.left = '50%';
      style.transform = 'translateX(-50%)';
    } else if (positioning.align === 'start') {
      style.left = `${Math.max(0, positioning.inset + positioning.offset)}px`;
    } else {
      style.right = `${Math.max(0, positioning.inset - positioning.offset)}px`;
    }
  }

  if (positioning.edge === 'top') {
    style.top = `${positioning.inset}px`;
    if (positioning.align === 'center') {
      style.left = '50%';
      style.transform = 'translateX(-50%)';
    } else if (positioning.align === 'start') {
      style.left = `${Math.max(0, positioning.inset + positioning.offset)}px`;
    } else {
      style.right = `${Math.max(0, positioning.inset - positioning.offset)}px`;
    }
  }

  if (positioning.edge === 'left') {
    style.left = `${positioning.inset}px`;
    if (positioning.align === 'center') {
      style.top = '50%';
      style.transform = 'translateY(-50%)';
    } else if (positioning.align === 'start') {
      style.top = `${Math.max(0, positioning.inset + positioning.offset)}px`;
    } else {
      style.bottom = `${Math.max(0, positioning.inset - positioning.offset)}px`;
    }
  }

  if (positioning.edge === 'right') {
    style.right = `${positioning.inset}px`;
    if (positioning.align === 'center') {
      style.top = '50%';
      style.transform = 'translateY(-50%)';
    } else if (positioning.align === 'start') {
      style.top = `${Math.max(0, positioning.inset + positioning.offset)}px`;
    } else {
      style.bottom = `${Math.max(0, positioning.inset - positioning.offset)}px`;
    }
  }

  return style;
}

function getDockLayerStyle(state: RuntimeState): CSSProperties {
  if (state.dock.position) {
    return {
      left: `${state.dock.position.x}px`,
      top: `${state.dock.position.y}px`,
    };
  }

  return getDefaultPlacementStyle(state);
}

function getWorkspaceState(tool: BaseToolContract, current?: ToolWorkspaceState): ToolWorkspaceState {
  if (current) {
    return current;
  }

  return {
    query: '',
    selectedItemId: tool.presentation?.surface?.items?.[0]?.id,
    draft: tool.presentation?.surface?.draft?.body ?? '',
    lastAction: undefined,
  };
}

function getOverlayState(tool: BaseToolContract, current?: OverlayWorkspaceState): OverlayWorkspaceState {
  if (current) {
    return current;
  }

  const controls = tool.presentation?.overlay?.controls ?? ['Guide', 'Snap', 'Focus'];

  return {
    cursorX: 0,
    cursorY: 0,
    controls: Object.fromEntries(controls.map((control) => [control, true])),
  };
}

export function LiDockProvider({
  children,
  runtime: providedRuntime,
  config,
  tools,
}: LiDockProviderProps) {
  const runtimeRef = useRef<DockRuntime | undefined>(undefined);

  if (!providedRuntime && !runtimeRef.current) {
    runtimeRef.current = createDockRuntime({ config });
  }

  const runtime = providedRuntime ?? runtimeRef.current!;

  useEffect(() => {
    if (!config) {
      return;
    }

    runtime.updateDockConfig(config);
  }, [config, runtime]);

  useEffect(() => {
    if (!tools?.length) {
      return;
    }

    for (const tool of tools) {
      runtime.registerTool(tool);
    }
  }, [runtime, tools]);

  return <LiDockContext.Provider value={runtime}>{children}</LiDockContext.Provider>;
}

export function LiDockDock({ className, style, onAction }: LiDockDockProps) {
  const runtime = useDockRuntime();
  const state = useDockRuntimeState();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [workspace, setWorkspace] = useState<Record<string, ToolWorkspaceState>>({});
  const [overlayWorkspace, setOverlayWorkspace] = useState<Record<string, OverlayWorkspaceState>>({});
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [shellHovered, setShellHovered] = useState(false);
  const [hoveredToolId, setHoveredToolId] = useState<string>();
  const [pointerX, setPointerX] = useState<number | null>(null);

  const orderedTools = useMemo(
    () =>
      state.registry.order
        .map((toolId) => state.registry.tools[toolId])
        .filter((tool): tool is BaseToolContract => Boolean(tool)),
    [state.registry.order, state.registry.tools],
  );

  const activeSurfaceTool = state.activeSurfaceToolId
    ? state.registry.tools[state.activeSurfaceToolId]
    : undefined;
  const activeOverlayToolId = Object.keys(state.overlays)[0];
  const activeOverlayTool = activeOverlayToolId ? state.registry.tools[activeOverlayToolId] : undefined;
  const inlineHoverLabels =
    state.dock.orientation === 'horizontal' && state.dock.config.item.labelMode === 'hover';

  const hoveredCaptionTool =
    state.dock.config.item.labelMode === 'hover' && hoveredToolId
      ? state.registry.tools[hoveredToolId]
      : undefined;
  const activeCaptionTool =
    state.dock.config.item.labelMode === 'active' && state.activeToolId
      ? state.registry.tools[state.activeToolId]
      : undefined;
  const captionTool = inlineHoverLabels ? activeCaptionTool : hoveredCaptionTool ?? activeCaptionTool;
  const shellActive = Boolean(state.activeToolId || state.activeSurfaceToolId || activeOverlayToolId);
  const shellEngaged = shellHovered || Boolean(hoveredToolId) || Boolean(dragState);

  useEffect(() => {
    if (!dragState) {
      return;
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerId !== dragState.pointerId) {
        return;
      }

      const nextPosition = {
        x: Math.round(dragState.origin.x + event.clientX - dragState.startX),
        y: Math.round(dragState.origin.y + event.clientY - dragState.startY),
      };

      runtime.setDockPosition(shellRef.current ? clampDockPosition(nextPosition, shellRef.current) : nextPosition);
    };

    const handleUp = (event: PointerEvent) => {
      if (event.pointerId === dragState.pointerId) {
        setDragState(null);
      }
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [dragState, runtime]);

  useEffect(() => {
    if (!state.dock.position) {
      return;
    }

    const handleResize = () => {
      if (!shellRef.current) {
        return;
      }

      runtime.setDockPosition(clampDockPosition(state.dock.position!, shellRef.current));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [runtime, state.dock.position]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (activeOverlayToolId) {
        runtime.deactivateOverlay(activeOverlayToolId);
        return;
      }

      if (state.activeSurfaceToolId) {
        runtime.closeSurface(state.activeSurfaceToolId);
        return;
      }

      if (state.activeToolId) {
        runtime.clearActiveTool();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeOverlayToolId, runtime, state.activeSurfaceToolId, state.activeToolId]);

  const dockVars = {
    '--ld-frame-padding': `${state.dock.config.frame.padding}px`,
    '--ld-frame-radius': `${state.dock.config.frame.radius}px`,
    '--ld-frame-blur': `${state.dock.config.frame.blur}px`,
    '--ld-frame-opacity': `${state.dock.config.frame.opacity}`,
    '--ld-frame-glow': `${state.dock.config.frame.glow}`,
    '--ld-frame-border-opacity': `${state.dock.config.frame.borderOpacity}`,
    '--ld-item-size': `${state.dock.config.item.size}px`,
    '--ld-item-padding': `${state.dock.config.item.padding}px`,
    '--ld-item-gap': `${state.dock.config.item.gap}px`,
    '--ld-item-radius': `${state.dock.config.item.radius}px`,
    '--ld-surface-width': `${activeSurfaceTool?.presentation?.surface?.width ?? state.dock.config.surface.width}px`,
    '--ld-surface-max-height': `${activeSurfaceTool?.presentation?.surface?.height ?? state.dock.config.surface.maxHeight}px`,
    '--ld-surface-radius': `${state.dock.config.surface.radius}px`,
    '--ld-surface-padding': `${state.dock.config.surface.padding}px`,
    '--ld-surface-blur': `${state.dock.config.surface.blur}px`,
    '--ld-surface-opacity': `${state.dock.config.surface.opacity}`,
    '--ld-motion-duration': `${state.dock.config.motion.duration}ms`,
    '--ld-motion-easing': state.dock.config.motion.easing,
  } as CSSProperties;

  const handleToolSelect = (tool: BaseToolContract) => {
    runtime.toggleTool(tool.id);

    if (tool.kind === 'action') {
      onAction?.(tool, runtime);
    }
  };

  const handleDragStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!state.dock.config.positioning.draggable || state.dock.isLocked) {
      return;
    }

    const rect = shellRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    runtime.setDockPosition({ x: rect.left, y: rect.top });
    setDragState({
      pointerId: event.pointerId,
      origin: { x: rect.left, y: rect.top },
      startX: event.clientX,
      startY: event.clientY,
    });
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  const getItemStyle = (tool: BaseToolContract): CSSProperties => {
    const accent = tool.presentation?.accent ?? '#8cc3ff';
    const rowRect = rowRef.current?.getBoundingClientRect();
    const itemRect = itemRefs.current[tool.id]?.getBoundingClientRect();
    const isActive =
      state.activeToolId === tool.id ||
      state.activeSurfaceToolId === tool.id ||
      Boolean(state.overlays[tool.id]);
    const inlineLabelVisible = inlineHoverLabels && hoveredToolId === tool.id;
    const dockLabel = tool.presentation?.dock?.label ?? tool.trigger.label;

    let scale = 1;
    let lift = 0;

    if (pointerX !== null && rowRect && itemRect) {
      const center =
        state.dock.orientation === 'horizontal'
          ? itemRect.left - rowRect.left + itemRect.width / 2
          : itemRect.top - rowRect.top + itemRect.height / 2;
      const distance = Math.abs(pointerX - center);
      const influence = clamp(1 - distance / state.dock.config.item.expansionRadius, 0, 1);
      const eased = influence * influence;

      scale = 1 + eased * state.dock.config.item.hoverScale;
      lift = -eased * state.dock.config.item.hoverLift;
    }

    return {
      '--ld-accent': accent,
      '--ld-item-scale': `${scale}`,
      '--ld-item-lift': `${lift}px`,
      '--ld-item-width': `${inlineLabelVisible ? getDockLabelWidth(dockLabel, state.dock.config.item.size) : state.dock.config.item.size}px`,
      '--ld-item-inline-padding': `${inlineLabelVisible ? 14 : state.dock.config.item.padding}px`,
      '--ld-item-engaged': `${inlineLabelVisible || isActive ? 1 : 0}`,
    } as CSSProperties;
  };

  const renderSurface = () => {
    if (!activeSurfaceTool) {
      return null;
    }

    const nextState = getWorkspaceState(activeSurfaceTool, workspace[activeSurfaceTool.id]);
    const presentation = activeSurfaceTool.presentation?.surface;
    const items = presentation?.items ?? [];
    const filteredItems = items.filter((item) =>
      [item.title, item.note, item.meta]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(nextState.query.toLowerCase()),
    );
    const selectedItemId =
      nextState.selectedItemId && filteredItems.some((item) => item.id === nextState.selectedItemId)
        ? nextState.selectedItemId
        : filteredItems[0]?.id;

    return (
      <div
        className="liquidock-surface"
        onPointerEnter={() => setShellHovered(true)}
        onPointerLeave={() => setShellHovered(false)}
        style={{ '--ld-accent': activeSurfaceTool.presentation?.accent ?? '#8cc3ff' } as CSSProperties}
      >
        <div className="liquidock-surface-header">
          <div>
            <div className="liquidock-surface-kicker">
              {presentation?.badge ?? activeSurfaceTool.presentation?.badge ?? activeSurfaceTool.kind}
            </div>
            <div className="liquidock-surface-title">
              {presentation?.title ?? activeSurfaceTool.trigger.label}
            </div>
            {(presentation?.summary ?? activeSurfaceTool.presentation?.summary) ? (
              <div className="liquidock-surface-summary">
                {presentation?.summary ?? activeSurfaceTool.presentation?.summary}
              </div>
            ) : null}
          </div>
          <div className="liquidock-surface-actions">
            {activeSurfaceTool.overlay ? (
              <button
                className="liquidock-button"
                data-kind="secondary"
                onClick={() =>
                  state.overlays[activeSurfaceTool.id]
                    ? runtime.deactivateOverlay(activeSurfaceTool.id)
                    : runtime.activateOverlay(activeSurfaceTool.id)
                }
                type="button"
              >
                {state.overlays[activeSurfaceTool.id] ? 'Hide overlay' : 'Show overlay'}
              </button>
            ) : null}
            <button
              className="liquidock-button"
              data-kind="secondary"
              onClick={() => runtime.closeSurface(activeSurfaceTool.id)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
        <div className="liquidock-surface-body">
          <input
            className="liquidock-search"
            onChange={(event) =>
              setWorkspace((current) => ({
                ...current,
                [activeSurfaceTool.id]: {
                  ...nextState,
                  query: event.target.value,
                },
              }))
            }
            placeholder={presentation?.searchPlaceholder ?? 'Filter items'}
            value={nextState.query}
          />
          {filteredItems.length ? (
            <div className="liquidock-surface-list">
              {filteredItems.map((item) => (
                <button
                  className="liquidock-surface-item"
                  data-active={item.id === selectedItemId}
                  key={item.id}
                  onClick={() =>
                    setWorkspace((current) => ({
                      ...current,
                      [activeSurfaceTool.id]: {
                        ...nextState,
                        selectedItemId: item.id,
                      },
                    }))
                  }
                  type="button"
                >
                  <div className="liquidock-surface-item-mark">
                    {item.keycap ?? item.title.slice(0, 2)}
                  </div>
                  <div>
                    <div className="liquidock-surface-item-title">{item.title}</div>
                    {item.note ? <div className="liquidock-surface-item-note">{item.note}</div> : null}
                  </div>
                  {item.meta ? <div className="liquidock-surface-item-meta">{item.meta}</div> : null}
                </button>
              ))}
            </div>
          ) : null}
          {presentation?.draft ? (
            <div>
              <div className="liquidock-draft-label">{presentation.draft.title}</div>
              <textarea
                className="liquidock-draft"
                onChange={(event) =>
                  setWorkspace((current) => ({
                    ...current,
                    [activeSurfaceTool.id]: {
                      ...nextState,
                      draft: event.target.value,
                    },
                  }))
                }
                placeholder={presentation.draft.placeholder}
                value={nextState.draft}
              />
            </div>
          ) : null}
        </div>
        <div className="liquidock-surface-footer">
          <div className="liquidock-surface-kicker">
            {nextState.lastAction ?? (selectedItemId ? `selected ${selectedItemId}` : 'ready')}
          </div>
          <div className="liquidock-surface-actions">
            {presentation?.actions?.map((action) => (
              <button
                className="liquidock-button"
                data-kind={action.kind ?? 'secondary'}
                key={action.id}
                onClick={() =>
                  setWorkspace((current) => ({
                    ...current,
                    [activeSurfaceTool.id]: {
                      ...nextState,
                      lastAction: action.label.toLowerCase(),
                    },
                  }))
                }
                type="button"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderOverlay = () => {
    if (!activeOverlayTool) {
      return null;
    }

    const nextState = getOverlayState(activeOverlayTool, overlayWorkspace[activeOverlayTool.id]);
    const controls = Object.entries(nextState.controls);

    return (
      <div
        className="liquidock-overlay"
        onPointerMove={(event) =>
          setOverlayWorkspace((current) => ({
            ...current,
            [activeOverlayTool.id]: {
              ...nextState,
              cursorX: Math.round(event.clientX),
              cursorY: Math.round(event.clientY),
            },
          }))
        }
        style={
          {
            '--ld-accent': activeOverlayTool.presentation?.accent ?? '#8cc3ff',
            '--ld-overlay-cursor-x': `${nextState.cursorX}px`,
            '--ld-overlay-cursor-y': `${nextState.cursorY}px`,
          } as CSSProperties
        }
      >
        <div className="liquidock-overlay-bar">
          <div>
            <div className="liquidock-surface-kicker">
              {activeOverlayTool.presentation?.overlay?.badge ??
                activeOverlayTool.presentation?.badge ??
                activeOverlayTool.overlay?.kind}
            </div>
            <div className="liquidock-overlay-title">
              {activeOverlayTool.presentation?.overlay?.title ?? activeOverlayTool.trigger.label}
            </div>
            {activeOverlayTool.presentation?.overlay?.summary ? (
              <div className="liquidock-overlay-summary">
                {activeOverlayTool.presentation.overlay.summary}
              </div>
            ) : null}
          </div>
          <button
            className="liquidock-button"
            data-kind="secondary"
            onClick={() => runtime.deactivateOverlay(activeOverlayTool.id)}
            type="button"
          >
            Close overlay
          </button>
        </div>
        <div className="liquidock-overlay-footer">
          <div className="liquidock-overlay-controls">
            {controls.map(([control, enabled]) => (
              <button
                className="liquidock-overlay-chip"
                data-active={enabled}
                key={control}
                onClick={() =>
                  setOverlayWorkspace((current) => ({
                    ...current,
                    [activeOverlayTool.id]: {
                      ...nextState,
                      controls: {
                        ...nextState.controls,
                        [control]: !enabled,
                      },
                    },
                  }))
                }
                type="button"
              >
                {control}
              </button>
            ))}
          </div>
          <div className="liquidock-overlay-cursor">
            {nextState.cursorX} {nextState.cursorY}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{LIQUIDOCK_STYLES}</style>
      {renderOverlay()}
      <div
        className={className ? `liquidock-layer ${className}` : 'liquidock-layer'}
        data-edge={state.dock.edge}
        ref={shellRef}
        style={{ ...getDockLayerStyle(state), ...dockVars, ...style }}
      >
        {captionTool ? (
          <div className="liquidock-caption">
            {captionTool.presentation?.dock?.label ?? captionTool.trigger.label}
          </div>
        ) : null}
        {renderSurface()}
        <div
          className="liquidock-frame"
          data-orientation={state.dock.orientation}
          data-shell-active={shellActive}
          data-shell-engaged={shellEngaged}
          onPointerEnter={() => setShellHovered(true)}
          onPointerLeave={() => setShellHovered(false)}
          style={
            {
              '--ld-shell-active': shellActive ? 1 : 0,
              '--ld-shell-engaged': shellEngaged ? 1 : 0,
            } as CSSProperties
          }
        >
          <button className="liquidock-handle" onPointerDown={handleDragStart} type="button">
            <span aria-hidden="true" className="liquidock-handle-dots">
              {Array.from({ length: 6 }).map((_, index) => (
                <span className="liquidock-handle-dot" key={index} />
              ))}
            </span>
          </button>
          <div
            className="liquidock-items"
            data-orientation={state.dock.orientation}
            onPointerLeave={() => {
              setHoveredToolId(undefined);
              setPointerX(null);
            }}
            onPointerMove={(event) => {
              const rowRect = rowRef.current?.getBoundingClientRect();
              if (!rowRect) {
                return;
              }

              setPointerX(
                state.dock.orientation === 'horizontal'
                  ? event.clientX - rowRect.left
                  : event.clientY - rowRect.top,
              );
            }}
            ref={rowRef}
          >
            {orderedTools.map((tool) => (
              <button
                aria-label={tool.trigger.label}
                aria-pressed={
                  state.activeToolId === tool.id ||
                  state.activeSurfaceToolId === tool.id ||
                  Boolean(state.overlays[tool.id])
                }
                className="liquidock-item"
                data-active={
                  state.activeToolId === tool.id ||
                  state.activeSurfaceToolId === tool.id ||
                  Boolean(state.overlays[tool.id])
                }
                data-inline-label={inlineHoverLabels && hoveredToolId === tool.id}
                key={tool.id}
                onClick={() => handleToolSelect(tool)}
                onPointerEnter={() => setHoveredToolId(tool.id)}
                ref={(element) => {
                  itemRefs.current[tool.id] = element;
                }}
                style={getItemStyle(tool)}
                title={tool.presentation?.dock?.hint ?? tool.presentation?.summary ?? tool.trigger.label}
                type="button"
              >
                <span className="liquidock-item-content">
                  <span className="liquidock-item-icon-wrap">
                    <span className="liquidock-item-icon">{iconForTool(tool)}</span>
                  </span>
                  <span className="liquidock-item-label">
                    {tool.presentation?.dock?.label ?? tool.trigger.label}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function LiDock({ children, runtime, config, tools, className, style, onAction }: LiDockProps) {
  return (
    <LiDockProvider config={config} runtime={runtime} tools={tools}>
      {children}
      <LiDockDock className={className} onAction={onAction} style={style} />
    </LiDockProvider>
  );
}
