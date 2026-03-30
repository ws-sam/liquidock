import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { DockConfigInput, DockEdge } from '@liquidock/core';
import { Liquidock } from '@liquidock/react';
import { defaultDockTools } from '@liquidock/tools';

const PLAYGROUND_STYLES = `
  :root {
    color-scheme: dark;
    font-family: "Avenir Next", "Segoe UI Variable", "Segoe UI", sans-serif;
    background: #060b11;
    color: #f4f7fb;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    margin: 0;
    min-height: 100%;
  }

  body {
    overflow: hidden;
    background:
      radial-gradient(circle at top, rgba(117, 172, 255, 0.16), transparent 28%),
      radial-gradient(circle at bottom right, rgba(132, 255, 214, 0.08), transparent 24%),
      linear-gradient(180deg, #050a10 0%, #08111a 100%);
  }

  button,
  input,
  select {
    font: inherit;
  }

  .playground-stage {
    position: relative;
    min-height: 100vh;
  }

  .playground-stage::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: 0.18;
    pointer-events: none;
  }

  .playground-panel {
    position: fixed;
    top: 18px;
    left: 18px;
    z-index: 30;
    width: min(320px, calc(100vw - 36px));
    display: grid;
    gap: 10px;
    padding: 14px;
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03)),
      rgba(7, 12, 18, 0.78);
    backdrop-filter: blur(22px);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.24);
  }

  .playground-panel-title {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(214, 224, 235, 0.56);
  }

  .playground-grid {
    display: grid;
    gap: 10px;
  }

  .playground-row {
    display: grid;
    gap: 6px;
  }

  .playground-row span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 12px;
    color: rgba(233, 239, 245, 0.8);
  }

  .playground-row input,
  .playground-row select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: rgba(245, 248, 251, 0.9);
    outline: none;
  }
`;

function NumberControl({
  label,
  max,
  min,
  onChange,
  step,
  value,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (nextValue: number) => void;
}) {
  return (
    <label className="playground-row">
      <span>
        {label}
        <strong>{value}</strong>
      </span>
      <input
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

function PlaygroundTuner({
  config,
  setConfig,
}: {
  config: DockConfigInput;
  setConfig: React.Dispatch<React.SetStateAction<DockConfigInput>>;
}) {
  const positioning = config.positioning ?? {};
  const item = config.item ?? {};
  const frame = config.frame ?? {};

  const setEdge = (edge: DockEdge) => {
    setConfig((current) => ({
      ...current,
      positioning: {
        ...current.positioning,
        edge,
      },
    }));
  };

  const setItemNumber = (key: 'size' | 'radius' | 'gap' | 'hoverScale') => (value: number) => {
    setConfig((current) => ({
      ...current,
      item: {
        ...current.item,
        [key]: value,
      },
    }));
  };

  const setFrameNumber = (key: 'blur' | 'glow' | 'opacity') => (value: number) => {
    setConfig((current) => ({
      ...current,
      frame: {
        ...current.frame,
        [key]: value,
      },
    }));
  };

  return (
    <div className="playground-panel">
      <div className="playground-panel-title">Dock config</div>
      <div className="playground-grid">
        <label className="playground-row">
          <span>
            Edge
            <strong>{positioning.edge ?? 'bottom'}</strong>
          </span>
          <select onChange={(event) => setEdge(event.target.value as DockEdge)} value={positioning.edge ?? 'bottom'}>
            <option value="bottom">bottom</option>
            <option value="top">top</option>
            <option value="left">left</option>
            <option value="right">right</option>
          </select>
        </label>
        <NumberControl label="Item size" max={80} min={44} onChange={setItemNumber('size')} step={1} value={item.size ?? 58} />
        <NumberControl label="Corner radius" max={28} min={10} onChange={setItemNumber('radius')} step={1} value={item.radius ?? 18} />
        <NumberControl label="Gap" max={24} min={4} onChange={setItemNumber('gap')} step={1} value={item.gap ?? 12} />
        <NumberControl label="Hover scale" max={0.6} min={0.1} onChange={setItemNumber('hoverScale')} step={0.02} value={item.hoverScale ?? 0.34} />
        <NumberControl label="Glass blur" max={40} min={8} onChange={setFrameNumber('blur')} step={1} value={frame.blur ?? 26} />
        <NumberControl label="Glow" max={0.55} min={0} onChange={setFrameNumber('glow')} step={0.02} value={frame.glow ?? 0.22} />
        <NumberControl label="Opacity" max={0.95} min={0.4} onChange={setFrameNumber('opacity')} step={0.01} value={frame.opacity ?? 0.78} />
      </div>
    </div>
  );
}

function App() {
  const [config, setConfig] = useState<DockConfigInput>({
    item: {
      size: 58,
      radius: 18,
      gap: 12,
      hoverScale: 0.36,
    },
    frame: {
      blur: 28,
      glow: 0.22,
      opacity: 0.8,
    },
  });

  return (
    <>
      <style>{PLAYGROUND_STYLES}</style>
      <div className="playground-stage">
        <Liquidock config={config} tools={defaultDockTools}>
          <PlaygroundTuner config={config} setConfig={setConfig} />
        </Liquidock>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
