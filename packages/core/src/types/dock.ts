export type DockEdge = 'top' | 'right' | 'bottom' | 'left';

export type DockOrientation = 'horizontal' | 'vertical';

export type DockAlignment = 'start' | 'center' | 'end';

export type DockItemLabelMode = 'never' | 'hover' | 'active';

export interface DockPosition {
  x: number;
  y: number;
}

export interface DockPositioningConfig {
  edge: DockEdge;
  align: DockAlignment;
  inset: number;
  offset: number;
  draggable: boolean;
}

export interface DockFrameConfig {
  padding: number;
  radius: number;
  blur: number;
  opacity: number;
  glow: number;
  borderOpacity: number;
}

export interface DockItemConfig {
  size: number;
  padding: number;
  gap: number;
  radius: number;
  hoverScale: number;
  hoverLift: number;
  expansionRadius: number;
  labelMode: DockItemLabelMode;
}

export interface DockSurfaceConfig {
  width: number;
  maxHeight: number;
  radius: number;
  padding: number;
  blur: number;
  opacity: number;
}

export interface DockMotionConfig {
  duration: number;
  easing: string;
}

export interface DockConfig {
  positioning: DockPositioningConfig;
  frame: DockFrameConfig;
  item: DockItemConfig;
  surface: DockSurfaceConfig;
  motion: DockMotionConfig;
}

export interface DockConfigInput {
  positioning?: Partial<DockPositioningConfig>;
  frame?: Partial<DockFrameConfig>;
  item?: Partial<DockItemConfig>;
  surface?: Partial<DockSurfaceConfig>;
  motion?: Partial<DockMotionConfig>;
}

export const DEFAULT_DOCK_CONFIG: DockConfig = {
  positioning: {
    edge: 'bottom',
    align: 'center',
    inset: 24,
    offset: 0,
    draggable: true,
  },
  frame: {
    padding: 10,
    radius: 28,
    blur: 26,
    opacity: 0.78,
    glow: 0.3,
    borderOpacity: 0.18,
  },
  item: {
    size: 56,
    padding: 10,
    gap: 12,
    radius: 18,
    hoverScale: 0.34,
    hoverLift: 16,
    expansionRadius: 132,
    labelMode: 'hover',
  },
  surface: {
    width: 420,
    maxHeight: 420,
    radius: 28,
    padding: 16,
    blur: 28,
    opacity: 0.82,
  },
  motion: {
    duration: 180,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
};

export interface DockState {
  edge: DockEdge;
  orientation: DockOrientation;
  isVisible: boolean;
  isLocked: boolean;
  position?: DockPosition;
  config: DockConfig;
}
