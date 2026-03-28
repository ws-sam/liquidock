import { useRef, ReactNode } from 'react';
import { createDockRuntime, DockRuntime } from '@liquidock/core';
import { LiquidockContext } from './hooks/useLiquidock';

export interface LiquidockProviderProps {
  children?: ReactNode;
  runtime?: DockRuntime;
}

export function LiquidockProvider({ children, runtime: providedRuntime }: LiquidockProviderProps) {
  const runtimeRef = useRef<DockRuntime | undefined>(undefined);

  if (!providedRuntime && !runtimeRef.current) {
    runtimeRef.current = createDockRuntime();
  }

  const runtime = providedRuntime ?? runtimeRef.current!;

  return (
    <LiquidockContext.Provider value={runtime}>
      <div className="liquidock-root">
        {children}
      </div>
    </LiquidockContext.Provider>
  );
}
