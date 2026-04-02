import { BaseToolContract, ToolSurfaceSpec, ToolOverlaySpec } from '@lidock/core';
import { ToolOptions } from './contracts';

export interface HybridToolOptions extends ToolOptions {
  surface?: ToolSurfaceSpec;
  overlay?: ToolOverlaySpec;
}

export function createHybridTool(options: HybridToolOptions): BaseToolContract {
  return {
    id: options.id,
    kind: 'hybrid',
    trigger: options.trigger,
    surface: options.surface,
    overlay: options.overlay,
    presentation: options.presentation,
  };
}
