import { RuntimeState } from './types.js';

export const createInitialState = (): RuntimeState => ({
  dock: {
    edge: 'bottom',
    orientation: 'horizontal',
    isVisible: true,
    isLocked: false,
  },
  registry: {
    tools: {},
    order: [],
  },
  overlays: {},
});
