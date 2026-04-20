import { createInitialState, getDockOrientation, mergeDockConfig } from './state.js';
import { RuntimeState } from './types.js';
import { BaseToolContract } from '../types/tool.js';
import { DockConfigInput, DockPosition } from '../types/dock.js';

export type DockRuntimeListener = (state: RuntimeState) => void;

export interface DockRuntime {
  getState: () => RuntimeState;
  registerTool: (tool: BaseToolContract) => void;
  getTool: (id: string) => BaseToolContract | undefined;
  activateTool: (id: string) => void;
  toggleTool: (id: string) => void;
  clearActiveTool: () => void;
  openSurface: (toolId: string) => void;
  closeSurface: (toolId: string) => void;
  activateOverlay: (toolId: string) => void;
  deactivateOverlay: (toolId: string) => void;
  updateDockConfig: (config: DockConfigInput) => void;
  setDockPosition: (position?: DockPosition) => void;
  subscribe: (listener: DockRuntimeListener) => () => void;
}

export interface CreateDockRuntimeOptions {
  config?: DockConfigInput;
}

const activateToolState = (currentState: RuntimeState, tool: BaseToolContract): RuntimeState => ({
  ...currentState,
  activeToolId: tool.id,
  activeSurfaceToolId: tool.surface ? tool.id : undefined,
  overlays: tool.overlay ? { [tool.id]: true } : {},
});

export const createDockRuntime = (options: CreateDockRuntimeOptions = {}): DockRuntime => {
  let state = createInitialState(options.config);
  const listeners = new Set<DockRuntimeListener>();

  const emit = () => {
    for (const listener of listeners) {
      listener(state);
    }
  };

  const updateState = (updater: (currentState: RuntimeState) => RuntimeState) => {
    state = updater(state);
    emit();
  };

  const getTool = (id: string) => state.registry.tools[id];

  const requireTool = (id: string) => {
    const tool = getTool(id);
    if (!tool) {
      throw new Error(`Unknown tool: ${id}`);
    }
    return tool;
  };

  return {
    getState: () => state,
    registerTool: (tool) => {
      updateState((currentState) => {
        const existingTool = currentState.registry.tools[tool.id];

        return {
          ...currentState,
          registry: {
            tools: {
              ...currentState.registry.tools,
              [tool.id]: tool,
            },
            order: existingTool
              ? currentState.registry.order
              : [...currentState.registry.order, tool.id],
          },
        };
      });
    },
    getTool,
    activateTool: (id) => {
      const tool = requireTool(id);
      updateState((currentState) => activateToolState(currentState, tool));
    },
    toggleTool: (id) => {
      const tool = requireTool(id);

      updateState((currentState) => {
        const isActive =
          currentState.activeToolId === id ||
          currentState.activeSurfaceToolId === id ||
          Boolean(currentState.overlays[id]);

        if (!isActive) {
          return activateToolState(currentState, tool);
        }

        const nextOverlays = { ...currentState.overlays };
        delete nextOverlays[id];

        return {
          ...currentState,
          activeToolId: currentState.activeToolId === id ? undefined : currentState.activeToolId,
          activeSurfaceToolId:
            currentState.activeSurfaceToolId === id ? undefined : currentState.activeSurfaceToolId,
          overlays: nextOverlays,
        };
      });
    },
    clearActiveTool: () => {
      updateState((currentState) => ({
        ...currentState,
        activeToolId: undefined,
      }));
    },
    openSurface: (toolId) => {
      const tool = requireTool(toolId);
      if (!tool.surface) {
        throw new Error(`Tool "${toolId}" does not define a surface`);
      }

      updateState((currentState) => ({
        ...currentState,
        activeSurfaceToolId: toolId,
      }));
    },
    closeSurface: (toolId) => {
      requireTool(toolId);
      updateState((currentState) => {
        if (currentState.activeSurfaceToolId !== toolId) {
          return currentState;
        }

        return {
          ...currentState,
          activeToolId:
            currentState.activeToolId === toolId && !currentState.overlays[toolId]
              ? undefined
              : currentState.activeToolId,
          activeSurfaceToolId: undefined,
        };
      });
    },
    activateOverlay: (toolId) => {
      const tool = requireTool(toolId);
      if (!tool.overlay) {
        throw new Error(`Tool "${toolId}" does not define an overlay`);
      }

      updateState((currentState) => ({
        ...currentState,
        activeToolId: toolId,
        overlays: { [toolId]: true },
      }));
    },
    deactivateOverlay: (toolId) => {
      requireTool(toolId);
      updateState((currentState) => {
        if (!currentState.overlays[toolId]) {
          return currentState;
        }

        const nextOverlays = { ...currentState.overlays };
        delete nextOverlays[toolId];

        return {
          ...currentState,
          activeToolId:
            currentState.activeToolId === toolId && currentState.activeSurfaceToolId !== toolId
              ? undefined
            : currentState.activeToolId,
          overlays: nextOverlays,
        };
      });
    },
    updateDockConfig: (config) => {
      updateState((currentState) => {
        const nextConfig = mergeDockConfig({
          ...currentState.dock.config,
          ...config,
          positioning: {
            ...currentState.dock.config.positioning,
            ...config.positioning,
          },
          frame: {
            ...currentState.dock.config.frame,
            ...config.frame,
          },
          item: {
            ...currentState.dock.config.item,
            ...config.item,
          },
          surface: {
            ...currentState.dock.config.surface,
            ...config.surface,
          },
          motion: {
            ...currentState.dock.config.motion,
            ...config.motion,
          },
        });

        return {
          ...currentState,
          dock: {
            ...currentState.dock,
            edge: nextConfig.positioning.edge,
            orientation: getDockOrientation(nextConfig.positioning.edge),
            config: nextConfig,
          },
        };
      });
    },
    setDockPosition: (position) => {
      updateState((currentState) => ({
        ...currentState,
        dock: {
          ...currentState.dock,
          position,
        },
      }));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};
