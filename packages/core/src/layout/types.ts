export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DockBounds {
  container: Rect;
  content: Rect;
}

// TODO: Define measurement contracts for tools and surfaces
