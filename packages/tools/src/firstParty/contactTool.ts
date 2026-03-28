import { createPanelTool } from '../createPanelTool';

export const contactTool = createPanelTool({
  id: 'contact',
  trigger: {
    id: 'contact-trigger',
    label: 'Contact',
    icon: 'mail',
  },
  surface: {
    kind: 'attached',
    size: {
      width: 320,
    },
  },
});
