import test from 'node:test';
import assert from 'node:assert/strict';
import { createDockRuntime } from '../dist/runtime/createDockRuntime.js';

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

function createRuntimeWithTools() {
  const runtime = createDockRuntime();

  runtime.registerTool(actionTool);
  runtime.registerTool(surfaceTool);
  runtime.registerTool(overlayTool);
  runtime.registerTool(secondOverlayTool);
  runtime.registerTool(hybridTool);

  return runtime;
}

test('activateTool on action tool sets activeToolId only', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);
  runtime.activateTool(actionTool.id);

  assert.equal(runtime.getState().activeToolId, actionTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, hybridTool.id);
  assert.deepEqual(runtime.getState().overlays, {
    [hybridTool.id]: true,
  });
});

test('activateTool on surface tool sets activeToolId and activeSurfaceToolId', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(overlayTool.id);
  runtime.activateTool(surfaceTool.id);

  assert.equal(runtime.getState().activeToolId, surfaceTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, surfaceTool.id);
  assert.deepEqual(runtime.getState().overlays, {
    [overlayTool.id]: true,
  });
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

test('activateTool on hybrid tool sets activeToolId, activeSurfaceToolId, and overlays entry', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);

  assert.equal(runtime.getState().activeToolId, hybridTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, hybridTool.id);
  assert.deepEqual(runtime.getState().overlays, {
    [hybridTool.id]: true,
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

test('openSurface on a surface tool does not change activeToolId', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(actionTool.id);
  runtime.openSurface(surfaceTool.id);

  assert.equal(runtime.getState().activeToolId, actionTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, surfaceTool.id);
});

test('openSurface on a tool without a surface throws', () => {
  const runtime = createRuntimeWithTools();

  assert.throws(() => runtime.openSurface(actionTool.id), {
    message: `Tool "${actionTool.id}" does not define a surface`,
  });
});

test('activateOverlay on overlay-only tool sets activeToolId to that tool', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(actionTool.id);
  runtime.activateOverlay(overlayTool.id);

  assert.equal(runtime.getState().activeToolId, overlayTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, undefined);
  assert.deepEqual(runtime.getState().overlays, {
    [overlayTool.id]: true,
  });
});

test('closeSurface is a no-op when activeSurfaceToolId does not match', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);
  runtime.closeSurface(surfaceTool.id);

  assert.equal(runtime.getState().activeToolId, hybridTool.id);
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

test('deactivateOverlay is a no-op when the overlay is not active', () => {
  const runtime = createRuntimeWithTools();

  runtime.activateTool(hybridTool.id);
  runtime.deactivateOverlay(overlayTool.id);

  assert.equal(runtime.getState().activeToolId, hybridTool.id);
  assert.equal(runtime.getState().activeSurfaceToolId, hybridTool.id);
  assert.deepEqual(runtime.getState().overlays, {
    [hybridTool.id]: true,
  });
});
