import { DockState } from '../types/dock.js';
import { BaseToolContract } from '../types/tool.js';

export interface ToolRegistryState {
  tools: Record<string, BaseToolContract>;
  order: string[];
}

export type OverlayActivityState = Record<string, boolean>;

export interface RuntimeState {
  dock: DockState;
  registry: ToolRegistryState;
  activeToolId?: string;
  activeSurfaceToolId?: string;
  overlays: OverlayActivityState;
}
