import { useContext, createContext, useSyncExternalStore } from 'react';
import type { DockRuntime, RuntimeState } from '@liquidock/core';

export const LiquidockContext = createContext<DockRuntime | null>(null);

export function useLiquidock() {
  const runtime = useContext(LiquidockContext);
  if (!runtime) {
    throw new Error('useLiquidock must be used within a LiquidockProvider');
  }
  return runtime;
}

export function useLiquidockState(): RuntimeState {
  const runtime = useLiquidock();

  return useSyncExternalStore(runtime.subscribe, runtime.getState, runtime.getState);
}
