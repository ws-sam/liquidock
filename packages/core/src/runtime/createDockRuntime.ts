import { createInitialState } from './state.js';
import { RuntimeState } from './types.js';
import { BaseToolContract } from '../types/tool.js';

export type DockRuntimeListener = (state: RuntimeState) => void;

export interface DockRuntime {
  getState: () => RuntimeState;
  registerTool: (tool: BaseToolContract) => void;
  getTool: (id: string) => BaseToolContract | undefined;
  activateTool: (id: string) => void;
  clearActiveTool: () => void;
  openSurface: (toolId: string) => void;
  closeSurface: (toolId: string) => void;
  activateOverlay: (toolId: string) => void;
  deactivateOverlay: (toolId: string) => void;
  subscribe: (listener: DockRuntimeListener) => () => void;
}

export const createDockRuntime = (): DockRuntime => {
  let state = createInitialState();
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
      updateState((currentState) => ({
        ...currentState,
        activeToolId: tool.id,
        activeSurfaceToolId: tool.surface ? tool.id : currentState.activeSurfaceToolId,
        overlays: tool.overlay ? { [tool.id]: true } : currentState.overlays,
      }));
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
          overlays: nextOverlays,
        };
      });
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};
