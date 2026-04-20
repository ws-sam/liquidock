import { createActionTool } from '../createActionTool';

export const homeTool = createActionTool({
  id: 'home',
  trigger: {
    id: 'home-trigger',
    label: 'Home',
    icon: 'home',
  },
  presentation: {
    accent: '#8cc3ff',
    badge: 'home',
    summary: 'Return to the primary workspace.',
    dock: {
      label: 'Home',
      hint: 'Select the primary lane',
    },
  },
});
