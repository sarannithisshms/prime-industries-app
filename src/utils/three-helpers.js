import * as THREE from 'three';

export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export function makeRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  return renderer;
}

export function fitToParent(renderer, camera, canvas) {
  const parent = canvas.parentElement;
  const w = parent.clientWidth;
  const h = parent.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(h, 1);
  camera.updateProjectionMatrix();
}

export function steelMaterial(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: opts.metalness ?? 0.75,
    roughness: opts.roughness ?? 0.32,
    emissive: opts.emissive || 0x000000,
    emissiveIntensity: opts.emissiveIntensity || 0,
  });
}

/**
 * Manual orbit controls: drag to rotate, wheel to zoom.
 * No external OrbitControls dependency — keeps the bundle small
 * and avoids version-mismatch issues with three's examples/ path.
 */
export function attachOrbitControls(canvas, camera, opts = {}) {
  const state = {
    theta: opts.theta || 0.6,
    phi: opts.phi || 1.15,
    radius: opts.radius || 9,
    minRadius: opts.minRadius || 4,
    maxRadius: opts.maxRadius || 16,
    dragging: false,
    lastX: 0,
    lastY: 0,
  };

  function updateCamera() {
    const { theta, phi, radius } = state;
    camera.position.set(
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.cos(theta)
    );
    camera.lookAt(0, opts.targetY || 0, 0);
  }

  function onDown(x, y) {
    state.dragging = true;
    state.lastX = x;
    state.lastY = y;
  }
  function onMove(x, y) {
    if (!state.dragging) return;
    const dx = x - state.lastX;
    const dy = y - state.lastY;
    state.lastX = x;
    state.lastY = y;
    state.theta -= dx * 0.006;
    state.phi -= dy * 0.006;
    state.phi = Math.max(0.35, Math.min(Math.PI - 0.35, state.phi));
    updateCamera();
  }
  function onUp() {
    state.dragging = false;
  }

  const mDown = (e) => onDown(e.clientX, e.clientY);
  const mMove = (e) => onMove(e.clientX, e.clientY);
  const mUp = () => onUp();
  const tStart = (e) => {
    const t = e.touches[0];
    onDown(t.clientX, t.clientY);
  };
  const tMove = (e) => {
    const t = e.touches[0];
    onMove(t.clientX, t.clientY);
    e.preventDefault();
  };
  const tEnd = () => onUp();
  const wheel = (e) => {
    e.preventDefault();
    state.radius += e.deltaY * 0.01;
    state.radius = Math.max(state.minRadius, Math.min(state.maxRadius, state.radius));
    updateCamera();
  };

  canvas.addEventListener('mousedown', mDown);
  window.addEventListener('mousemove', mMove);
  window.addEventListener('mouseup', mUp);
  canvas.addEventListener('touchstart', tStart, { passive: true });
  canvas.addEventListener('touchmove', tMove, { passive: false });
  canvas.addEventListener('touchend', tEnd);
  canvas.addEventListener('wheel', wheel, { passive: false });

  updateCamera();

  return {
    dispose() {
      canvas.removeEventListener('mousedown', mDown);
      window.removeEventListener('mousemove', mMove);
      window.removeEventListener('mouseup', mUp);
      canvas.removeEventListener('touchstart', tStart);
      canvas.removeEventListener('touchmove', tMove);
      canvas.removeEventListener('touchend', tEnd);
      canvas.removeEventListener('wheel', wheel);
    },
  };
}
