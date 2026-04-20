import { ToolSurfaceSpec } from './surface.js';
import { ToolOverlaySpec } from './overlay.js';

export type ToolKind = 'action' | 'panel' | 'overlay' | 'hybrid';

export interface ToolTriggerSpec {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
}

export interface ToolDockPresentationSpec {
  label?: string;
  hint?: string;
}

export interface ToolUtilityItemSpec {
  id: string;
  title: string;
  note?: string;
  meta?: string;
  keycap?: string;
}

export interface ToolUtilityActionSpec {
  id: string;
  label: string;
  kind?: 'primary' | 'secondary';
}

export interface ToolSurfacePresentationSpec {
  title?: string;
  width?: number;
  height?: number;
  badge?: string;
  summary?: string;
  searchPlaceholder?: string;
  items?: ToolUtilityItemSpec[];
  draft?: {
    title: string;
    body: string;
    placeholder?: string;
  };
  actions?: ToolUtilityActionSpec[];
}

export interface ToolOverlayPresentationSpec {
  title?: string;
  summary?: string;
  badge?: string;
  controls?: string[];
}

export interface ToolPresentationSpec {
  accent?: string;
  badge?: string;
  summary?: string;
  dock?: ToolDockPresentationSpec;
  surface?: ToolSurfacePresentationSpec;
  overlay?: ToolOverlayPresentationSpec;
}

export interface BaseToolContract {
  id: string;
  kind: ToolKind;
  trigger: ToolTriggerSpec;
  surface?: ToolSurfaceSpec;
  overlay?: ToolOverlaySpec;
  presentation?: ToolPresentationSpec;
}
