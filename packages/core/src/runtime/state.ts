import { DockConfig, DockConfigInput, DEFAULT_DOCK_CONFIG, DockEdge } from '../types/dock.js';
import { RuntimeState } from './types.js';

export const getDockOrientation = (edge: DockEdge) =>
  edge === 'left' || edge === 'right' ? 'vertical' : 'horizontal';

export const mergeDockConfig = (config: DockConfigInput = {}): DockConfig => ({
  positioning: {
    ...DEFAULT_DOCK_CONFIG.positioning,
    ...config.positioning,
  },
  frame: {
    ...DEFAULT_DOCK_CONFIG.frame,
    ...config.frame,
  },
  item: {
    ...DEFAULT_DOCK_CONFIG.item,
    ...config.item,
  },
  surface: {
    ...DEFAULT_DOCK_CONFIG.surface,
    ...config.surface,
  },
  motion: {
    ...DEFAULT_DOCK_CONFIG.motion,
    ...config.motion,
  },
});

export const createInitialState = (config?: DockConfigInput): RuntimeState => {
  const resolvedConfig = mergeDockConfig(config);

  return {
    dock: {
      edge: resolvedConfig.positioning.edge,
      orientation: getDockOrientation(resolvedConfig.positioning.edge),
      isVisible: true,
      isLocked: false,
      config: resolvedConfig,
    },
    registry: {
      tools: {},
      order: [],
    },
    overlays: {},
  };
};
