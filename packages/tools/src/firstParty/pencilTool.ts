import { createHybridTool } from '../createHybridTool';

export const pencilTool = createHybridTool({
  id: 'pencil',
  trigger: {
    id: 'pencil-trigger',
    label: 'Pencil',
    icon: 'pencil',
  },
  surface: {
    kind: 'attached',
    size: {
      width: 240,
    },
  },
  overlay: {
    kind: 'canvas',
    isInteractive: true,
  },
});
