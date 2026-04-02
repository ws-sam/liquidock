import { BaseToolContract, ToolSurfaceSpec } from '@lidock/core';
import { ToolOptions } from './contracts';

export interface PanelToolOptions extends ToolOptions {
  surface: ToolSurfaceSpec;
}

export function createPanelTool(options: PanelToolOptions): BaseToolContract {
  return {
    id: options.id,
    kind: 'panel',
    trigger: options.trigger,
    surface: options.surface,
    presentation: options.presentation,
  };
}
