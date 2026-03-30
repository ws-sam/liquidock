import { ToolTriggerSpec, ToolPresentationSpec } from '@liquidock/core';

export interface ToolOptions {
  id: string;
  trigger: ToolTriggerSpec;
  presentation?: ToolPresentationSpec;
}
