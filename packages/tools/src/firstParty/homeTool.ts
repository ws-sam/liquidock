import { createActionTool } from '../createActionTool';

export const homeTool = createActionTool({
  id: 'home',
  trigger: {
    id: 'home-trigger',
    label: 'Home',
    icon: 'home',
  },
});
