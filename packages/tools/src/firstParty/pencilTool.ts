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
  presentation: {
    accent: '#ffb86b',
    badge: 'canvas',
    summary: 'Open the sketch surface and overlay lane.',
    dock: {
      label: 'Pencil',
      hint: 'Sketch overlay utility',
    },
    surface: {
      title: 'Sketch lane',
      width: 424,
      badge: 'canvas',
      summary: 'Adjust the lane, then switch the overlay on and off from the dock.',
      searchPlaceholder: 'Filter controls',
      items: [
        {
          id: 'marker',
          title: 'Marker preset',
          note: 'Wide stroke for loose notes.',
          meta: 'live',
          keycap: 'MK',
        },
        {
          id: 'pen',
          title: 'Pen preset',
          note: 'Tighter line for markup.',
          meta: 'focus',
          keycap: 'PN',
        },
      ],
      draft: {
        title: 'Session notes',
        body: 'Overlay ready. Cursor, guide, and focus controls are available in the viewport lane.',
        placeholder: 'Capture session notes',
      },
      actions: [
        {
          id: 'review',
          label: 'Review lane',
        },
      ],
    },
    overlay: {
      title: 'Sketch overlay',
      summary: 'Viewport lane stays active while the dock remains mounted.',
      badge: 'overlay',
      controls: ['Guide', 'Snap', 'Focus'],
    },
  },
});
