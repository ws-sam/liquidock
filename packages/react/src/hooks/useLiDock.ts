import { useContext, useSyncExternalStore } from 'react';
import type { DockRuntime, RuntimeState } from '@lidock/core';
import { LiDockContext } from '../LiDock';

export function useLiDock() {
  const runtime = useContext(LiDockContext);
  if (!runtime) {
    throw new Error('useLiDock must be used within a LiDockProvider');
  }
  return runtime;
}

export function useLiDockState(): RuntimeState {
  const runtime = useLiDock();

  return useSyncExternalStore(runtime.subscribe, runtime.getState, runtime.getState);
}
