import { BaseToolContract } from '@lidock/core';
import { ToolOptions } from './contracts';

export function createActionTool(options: ToolOptions): BaseToolContract {
  return {
    id: options.id,
    kind: 'action',
    trigger: options.trigger,
    presentation: options.presentation,
  };
}
