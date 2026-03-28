import { createActionTool } from '../createActionTool';

export const githubTool = createActionTool({
  id: 'github',
  trigger: {
    id: 'github-trigger',
    label: 'GitHub',
    icon: 'github',
  },
});
