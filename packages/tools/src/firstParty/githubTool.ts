import { createActionTool } from '../createActionTool';

export const githubTool = createActionTool({
  id: 'github',
  trigger: {
    id: 'github-trigger',
    label: 'GitHub',
    icon: 'github',
  },
  presentation: {
    accent: '#b8c6ff',
    badge: 'source',
    summary: 'Jump to the source workspace.',
    dock: {
      label: 'GitHub',
      hint: 'Source handoff',
    },
  },
});
