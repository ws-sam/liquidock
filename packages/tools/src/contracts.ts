import { ToolTriggerSpec, ToolPresentationSpec } from '@lidock/core';

export interface ToolOptions {
  id: string;
  trigger: ToolTriggerSpec;
  presentation?: ToolPresentationSpec;
}
