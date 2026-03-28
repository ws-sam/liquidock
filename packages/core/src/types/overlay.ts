export type OverlayKind = 'viewport' | 'canvas' | 'mask';

export interface ToolOverlaySpec {
  kind: OverlayKind;
  isInteractive?: boolean;
  isPersistent?: boolean;
}
