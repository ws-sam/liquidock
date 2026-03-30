import { createActionTool } from '../createActionTool';

export const youtubeTool = createActionTool({
  id: 'youtube',
  trigger: {
    id: 'youtube-trigger',
    label: 'YouTube',
    icon: 'youtube',
  },
  presentation: {
    accent: '#ff7f7f',
    badge: 'media',
    summary: 'Open the video handoff.',
    dock: {
      label: 'YouTube',
      hint: 'Video handoff',
    },
  },
});
