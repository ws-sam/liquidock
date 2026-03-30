import { BaseToolContract, ToolOverlaySpec } from '@liquidock/core';
import { ToolOptions } from './contracts';

export interface OverlayToolOptions extends ToolOptions {
  overlay: ToolOverlaySpec;
}

export function createOverlayTool(options: OverlayToolOptions): BaseToolContract {
  return {
    id: options.id,
    kind: 'overlay',
    trigger: options.trigger,
    overlay: options.overlay,
    presentation: options.presentation,
  };
}
