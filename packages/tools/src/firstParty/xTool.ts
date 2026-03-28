import { createActionTool } from '../createActionTool';

export const xTool = createActionTool({
  id: 'x',
  trigger: {
    id: 'x-trigger',
    label: 'X',
    icon: 'x',
  },
});
