import { ToolSurfaceSpec } from './surface.js';
import { ToolOverlaySpec } from './overlay.js';

export type ToolKind = 'action' | 'panel' | 'overlay' | 'hybrid';

export interface ToolTriggerSpec {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
}

export interface BaseToolContract {
  id: string;
  kind: ToolKind;
  trigger: ToolTriggerSpec;
  surface?: ToolSurfaceSpec;
  overlay?: ToolOverlaySpec;
}
