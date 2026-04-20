import { createActionTool } from '../createActionTool';

export const xTool = createActionTool({
  id: 'x',
  trigger: {
    id: 'x-trigger',
    label: 'X',
    icon: 'x',
  },
  presentation: {
    accent: '#9be3d4',
    badge: 'social',
    summary: 'Open the short post handoff.',
    dock: {
      label: 'X',
      hint: 'Short post handoff',
    },
  },
});
