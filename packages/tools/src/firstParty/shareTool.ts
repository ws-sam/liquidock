import { createPanelTool } from '../createPanelTool';

export const shareTool = createPanelTool({
  id: 'share',
  trigger: {
    id: 'share-trigger',
    label: 'Share',
    icon: 'share',
  },
  surface: {
    kind: 'attached',
    size: {
      width: 320,
    },
  },
});
