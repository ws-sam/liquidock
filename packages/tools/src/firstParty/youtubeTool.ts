import { createActionTool } from '../createActionTool';

export const youtubeTool = createActionTool({
  id: 'youtube',
  trigger: {
    id: 'youtube-trigger',
    label: 'YouTube',
    icon: 'youtube',
  },
});
