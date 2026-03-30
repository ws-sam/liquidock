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
  presentation: {
    accent: '#7ee4da',
    badge: 'contact',
    summary: 'Route a message and stage a reply.',
    dock: {
      label: 'Contact',
      hint: 'Open message utility',
    },
    surface: {
      title: 'Contact queue',
      width: 432,
      badge: 'contact',
      summary: 'Choose a route, adjust the reply, hand off when ready.',
      searchPlaceholder: 'Filter routes',
      items: [
        {
          id: 'email',
          title: 'Email',
          note: 'Long-form thread with context.',
          meta: 'default',
          keycap: 'EM',
        },
        {
          id: 'direct-message',
          title: 'Direct message',
          note: 'Short reach-out lane.',
          meta: 'fast',
          keycap: 'DM',
        },
      ],
      draft: {
        title: 'Reply draft',
        body: 'Thanks for the note. The draft is ready for edits before handoff.',
        placeholder: 'Draft reply',
      },
      actions: [
        {
          id: 'queue',
          label: 'Queue draft',
          kind: 'primary',
        },
        {
          id: 'switch',
          label: 'Switch route',
        },
      ],
    },
  },
});
