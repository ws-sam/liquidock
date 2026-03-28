import React from 'react';
import ReactDOM from 'react-dom/client';
import { createDockRuntime, BaseToolContract } from '@liquidock/core';
import { LiquidockProvider, useLiquidock, useLiquidockState } from '@liquidock/react';
import { defaultDockTools } from '@liquidock/tools';

const runtime = createDockRuntime();

for (const tool of defaultDockTools) {
  runtime.registerTool(tool);
}

const appFrameStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f5f5f5',
  color: '#111111',
  fontFamily: 'sans-serif',
};

const contentStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: '0 auto',
  padding: '32px 20px 48px',
};

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #d0d0d0',
  borderRadius: 12,
  padding: 16,
};

function getToolTitle(tool: BaseToolContract) {
  return tool.trigger.label;
}

function App() {
  return (
    <LiquidockProvider runtime={runtime}>
      <PlaygroundApp />
    </LiquidockProvider>
  );
}

function PlaygroundApp() {
  const runtimeApi = useLiquidock();
  const state = useLiquidockState();

  const tools = state.registry.order
    .map((toolId) => runtimeApi.getTool(toolId))
    .filter((tool): tool is BaseToolContract => Boolean(tool));

  const activeSurfaceTool = state.activeSurfaceToolId
    ? runtimeApi.getTool(state.activeSurfaceToolId)
    : undefined;

  const activeOverlayTools = Object.keys(state.overlays)
    .map((toolId) => runtimeApi.getTool(toolId))
    .filter((tool): tool is BaseToolContract => Boolean(tool));

  return (
    <div style={appFrameStyle}>
      <div style={contentStyle}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 32 }}>Liquidock Playground</h1>
          <p style={{ margin: '8px 0 0', lineHeight: 1.5 }}>
            First browser-viewable runtime prototype. One active tool, one attached surface, overlays tracked separately.
          </p>
        </header>

        <main style={{ display: 'grid', gap: 16 }}>
          <section style={cardStyle}>
            <h2 style={{ marginTop: 0, fontSize: 18 }}>Page Shell</h2>
            <p style={{ marginBottom: 0, lineHeight: 1.5 }}>
              The dock runtime lives below. Action tools are inert. Surface and overlay behavior is intentionally simple.
            </p>
          </section>

          <section style={{ ...cardStyle, position: 'relative', minHeight: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Attached Surface Area</h2>
              <span>active tool: {state.activeToolId ?? 'none'}</span>
            </div>

            {activeSurfaceTool ? (
              <div
                style={{
                  border: '1px solid #c8c8c8',
                  borderRadius: 10,
                  background: '#fafafa',
                  padding: 16,
                  width: activeSurfaceTool.surface?.size?.width ?? 320,
                  maxWidth: '100%',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <strong>{getToolTitle(activeSurfaceTool)}</strong>
                  <button onClick={() => runtimeApi.closeSurface(activeSurfaceTool.id)}>Close</button>
                </div>
                <p style={{ marginBottom: 0, lineHeight: 1.5 }}>
                  Attached surface for <code>{activeSurfaceTool.id}</code>. No drag, edge-snapping, layout intelligence, or advanced modes yet.
                </p>
              </div>
            ) : (
              <div
                style={{
                  border: '1px dashed #c8c8c8',
                  borderRadius: 10,
                  padding: 16,
                  color: '#555555',
                }}
              >
                No attached surface open.
              </div>
            )}

            <div
              style={{
                position: 'absolute',
                inset: 16,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
              }}
            >
              <div
                style={{
                  minWidth: 220,
                  border: '1px solid #b5b5b5',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.94)',
                  padding: 12,
                }}
              >
                <strong style={{ display: 'block', marginBottom: 8 }}>Overlay Layer</strong>
                {activeOverlayTools.length > 0 ? (
                  activeOverlayTools.map((tool) => (
                    <div key={tool.id} style={{ marginTop: 8 }}>
                      <div>{getToolTitle(tool)}</div>
                      <div style={{ color: '#555555', lineHeight: 1.4 }}>
                        Viewport-aware overlay placeholder for <code>{tool.id}</code>.
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#555555' }}>No active overlays.</div>
                )}
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0, fontSize: 18 }}>Dock Row</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tools.map((tool) => {
                const isActive = state.activeToolId === tool.id;
                const hasSurfaceOpen = state.activeSurfaceToolId === tool.id;
                const hasOverlayActive = Boolean(state.overlays[tool.id]);

                return (
                  <button
                    key={tool.id}
                    onClick={() => runtimeApi.activateTool(tool.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid #c8c8c8',
                      background: isActive ? '#e8eefc' : '#ffffff',
                      textAlign: 'left',
                    }}
                  >
                    <div>{tool.trigger.label}</div>
                    <div style={{ fontSize: 12, color: '#555555' }}>
                      {tool.kind}
                      {hasSurfaceOpen ? ' | surface' : ''}
                      {hasOverlayActive ? ' | overlay' : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
