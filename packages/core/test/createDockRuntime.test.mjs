import test from 'node:test';
import assert from 'node:assert/strict';
import { createDockRuntime } from '../dist/runtime/createDockRuntime.js';
import { DEFAULT_DOCK_CONFIG } from '../dist/types/dock.js';

const actionTool = {
  id: 'home',
  kind: 'action',
  trigger: {
    id: 'home-trigger',
    label: 'Home',
  },
};

const surfaceTool = {
  id: 'share',
  kind: 'panel',
  trigger: {
    id: 'share-trigger',
    label: 'Share',
  },
  surface: {
    kind: 'attached',
  },
};

const overlayTool = {
  id: 'draw',
  kind: 'overlay',
  trigger: {
    id: 'draw-trigger',
    label: 'Draw',
  },
  overlay: {
    kind: 'viewport',
  },
};

const secondOverlayTool = {
  id: 'erase',
  kind: 'overlay',
  trigger: {
    id: 'erase-trigger',
    label: 'Erase',
  },
  overlay: {
    kind: 'viewport',
  },
};

const hybridTool = {
  id: 'pencil',
  kind: 'hybrid',
  trigger: {
    id: 'pencil-trigger',
    label: 'Pencil',
  },
  surface: {
    kind: 'attached',
  },
  overlay: {
    kind: 'canvas',
  },
};

function createRuntimeWithTools(config) {
  const runtime = createDockRuntime({ config });

  runtime.registerTool(actionTool);
  runtime.registerTool(surfaceTool);
  runtime.registerTool(overlayTool);
  runtime.registerTool(secondOverlayTool);
  runtime.registerTool(hybridTool);

  return runtime;
}

test('activateTool on action tool clears surface and overlay state', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);
  runtime.activateTool(actionTool.id);

  assert.equal(runtime.getState().activeToolId, actionTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, undefined);
  assert.deepEqual(runtime.getState().overlays, {});
});

test('activateTool on surface tool opens the surface and clears overlays', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(overlayTool.id);
  runtime.activateTool(surfaceTool.id);

  assert.equal(runtime.getState().activeToolId, surfaceTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, surfaceTool.id);
  assert.deepEqual(runtime.getState().overlays, {});
});

test('activateTool on overlay tool sets activeToolId and overlays entry', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(overlayTool.id);

  assert.equal(runtime.getState().activeToolId, overlayTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, undefined);
  assert.deepEqual(runtime.getState().overlays, {
    [overlayTool.id]: true,
  });
});

test('activateTool on hybrid tool sets surface and overlay state together', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);

  assert.equal(runtime.getState().activeToolId, hybridTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, hybridTool.id);
  assert.deepEqual(runtime.getState().overlays, {
    [hybridTool.id]: true,
  });
});

test('toggleTool on a hybrid tool clears its owned state', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);
  runtime.toggleTool(hybridTool.id);

  assert.equal(runtime.getState().activeToolId, undefined);
  assert.equal(runtime.getState().activeSurfaceToolId, undefined);
  assert.deepEqual(runtime.getState().overlays, {});
});

test('toggleTool can clear a hybrid surface while another overlay stays active', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);
  runtime.activateOverlay(overlayTool.id);
  runtime.toggleTool(hybridTool.id);

  assert.equal(runtime.getState().activeToolId, overlayTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, undefined);
  assert.deepEqual(runtime.getState().overlays, {
    [overlayTool.id]: true,
  });
});

test('closeSurface on hybrid tool preserves activeToolId if overlay is still active', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);
  runtime.closeSurface(hybridTool.id);

  assert.equal(runtime.getState().activeToolId, hybridTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, undefined);
  assert.deepEqual(runtime.getState().overlays, {
    [hybridTool.id]: true,
  });
});

test('deactivateOverlay on hybrid tool preserves activeToolId if surface is still open', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);
  runtime.deactivateOverlay(hybridTool.id);

  assert.equal(runtime.getState().activeToolId, hybridTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, hybridTool.id);
  assert.deepEqual(runtime.getState().overlays, {});
});

test('closeSurface on surface-only tool clears activeToolId', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(surfaceTool.id);
  runtime.closeSurface(surfaceTool.id);

  assert.equal(runtime.getState().activeToolId, undefined);
  assert.equal(runtime.getState().activeSurfaceToolId, undefined);
});

test('deactivateOverlay on overlay-only tool clears activeToolId', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(overlayTool.id);
  runtime.deactivateOverlay(overlayTool.id);

  assert.equal(runtime.getState().activeToolId, undefined);
  assert.equal(runtime.getState().activeSurfaceToolId, undefined);
  assert.deepEqual(runtime.getState().overlays, {});
});

test('clearActiveTool only clears activeToolId', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);
  runtime.clearActiveTool();

  assert.equal(runtime.getState().activeToolId, undefined);
  assert.equal(runtime.getState().activeSurfaceToolId, hybridTool.id);
  assert.deepEqual(runtime.getState().overlays, {
    [hybridTool.id]: true,
  });
});

test('activateOverlay replaces the previously active overlay', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateOverlay(overlayTool.id);
  runtime.activateOverlay(secondOverlayTool.id);

  assert.equal(runtime.getState().activeToolId, secondOverlayTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, undefined);
  assert.deepEqual(runtime.getState().overlays, {
    [secondOverlayTool.id]: true,
  });
});

test('activateOverlay switches overlays without changing surface state', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);
  runtime.activateOverlay(overlayTool.id);

  assert.equal(runtime.getState().activeToolId, overlayTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, hybridTool.id);
  assert.deepEqual(runtime.getState().overlays, {
    [overlayTool.id]: true,
  });
});

test('dock config initializes from defaults and accepts partial overrides', () => {
  const runtime = createRuntimeWithTools({
    item: {
      radius: 24,
    },
  });

  assert.equal(runtime.getState().dock.config.item.radius, 24);
  assert.equal(runtime.getState().dock.config.item.size, DEFAULT_DOCK_CONFIG.item.size);
  assert.equal(
    runtime.getState().dock.config.positioning.edge,
    DEFAULT_DOCK_CONFIG.positioning.edge,
  );
});

test('updateDockConfig merges nested config and updates edge-derived orientation', () => {
  const runtime = createRuntimeWithTools();

  runtime.updateDockConfig({
    positioning: {
      edge: 'left',
      inset: 40,
    },
    item: {
      hoverScale: 0.5,
    },
  });

  assert.equal(runtime.getState().dock.edge, 'left');
  assert.equal(runtime.getState().dock.orientation, 'vertical');
  assert.equal(runtime.getState().dock.config.positioning.inset, 40);
  assert.equal(runtime.getState().dock.config.item.hoverScale, 0.5);
  assert.equal(runtime.getState().dock.config.item.radius, DEFAULT_DOCK_CONFIG.item.radius);
});

test('setDockPosition persists drag coordinates in runtime state', () => {
  const runtime = createRuntimeWithTools();

  runtime.setDockPosition({ x: 144, y: 288 });

  assert.deepEqual(runtime.getState().dock.position, { x: 144, y: 288 });

  runtime.setDockPosition(undefined);

  assert.equal(runtime.getState().dock.position, undefined);
});
