export type DockEdge = 'top' | 'right' | 'bottom' | 'left';

export type DockOrientation = 'horizontal' | 'vertical';

export interface DockState {
  edge: DockEdge;
  orientation: DockOrientation;
  isVisible: boolean;
  isLocked: boolean;
}
