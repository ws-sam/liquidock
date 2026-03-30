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
  presentation: {
    accent: '#ffd166',
    badge: 'share',
    summary: 'Bundle outbound targets and copy.',
    dock: {
      label: 'Share',
      hint: 'Open outbound utility',
    },
    surface: {
      title: 'Share bundle',
      width: 468,
      badge: 'share',
      summary: 'Queue a payload, pick a target, keep the draft local.',
      searchPlaceholder: 'Filter targets',
      items: [
        {
          id: 'link-bundle',
          title: 'Link bundle',
          note: 'URL, short link, embed snippet.',
          meta: 'ready',
          keycap: 'LB',
        },
        {
          id: 'email-draft',
          title: 'Email draft',
          note: 'Subject and summary block.',
          meta: 'draft',
          keycap: 'EM',
        },
        {
          id: 'social-handoff',
          title: 'Social handoff',
          note: 'Short post with paired asset.',
          meta: 'queued',
          keycap: 'SH',
        },
      ],
      draft: {
        title: 'Payload',
        body: 'liquidock / preview\nCompact dock layer ready for share handoff.',
        placeholder: 'Compose payload',
      },
      actions: [
        {
          id: 'copy',
          label: 'Copy payload',
          kind: 'primary',
        },
        {
          id: 'stage',
          label: 'Stage target',
        },
      ],
    },
  },
});
