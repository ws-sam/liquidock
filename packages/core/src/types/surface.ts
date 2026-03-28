export type SurfaceKind = 'attached' | 'detached' | 'popover';

export interface ToolSurfaceSpec {
  kind: SurfaceKind;
  size?: {
    width?: number | string;
    height?: number | string;
  };
  isResizable?: boolean;
}
