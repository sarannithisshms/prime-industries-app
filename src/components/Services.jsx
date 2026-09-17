import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { supportsWebGL, makeRenderer, fitToParent, steelMaterial } from '../utils/three-helpers.js';

function ServicesScene({ active }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const groupsRef = useRef({});
  const [webgl] = useState(supportsWebGL);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!webgl) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const renderer = makeRenderer(canvas);
    fitToParent(renderer, camera, canvas);

    scene.add(new THREE.AmbientLight(0x8aa0c0, 0.6));
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(4, 6, 5);
    scene.add(dl);

    const root = new THREE.Group();
    scene.add(root);

    // Sheet metal: bending hinge
    const sheetGroup = new THREE.Group();
    const panelA = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 1.2), steelMaterial(0x8b95a3, { roughness: 0.25, metalness: 0.85 }));
    panelA.position.x = -0.8;
    const panelB = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.08, 1.2),
      steelMaterial(0xf97316, { roughness: 0.3, metalness: 0.6, emissive: 0xf97316, emissiveIntensity: 0.06 })
    );
    const pivot = new THREE.Group();
    panelB.position.x = 0.8;
    pivot.add(panelB);
    sheetGroup.add(panelA, pivot);
    root.add(sheetGroup);

    // CNC machining: spindle plunging into workpiece
    const cncGroup = new THREE.Group();
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 1.2), steelMaterial(0x3c4a5e, { roughness: 0.45 }));
    block.position.y = -0.35;
    cncGroup.add(block);
    const tool = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 16), steelMaterial(0xd7dde5, { metalness: 0.9, roughness: 0.15 }));
    tool.position.y = 0.5;
    cncGroup.add(tool);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 10, 20), steelMaterial(0xf97316, { emissive: 0xf97316, emissiveIntensity: 0.3 }));
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.0;
    cncGroup.add(collar);
    root.add(cncGroup);

    // Laser cutting: sweeping beam over a plate
    const laserGroup = new THREE.Group();
    const lp = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.2), steelMaterial(0x3c4a5e, { roughness: 0.4 }));
    laserGroup.add(lp);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.6, 8), new THREE.MeshBasicMaterial({ color: 0xf97316 }));
    beam.position.y = 0.85;
    laserGroup.add(beam);
    const beamGlow = new THREE.PointLight(0xf97316, 2, 2.5);
    laserGroup.add(beamGlow);
    root.add(laserGroup);

    groupsRef.current = { sheet: sheetGroup, cnc: cncGroup, laser: laserGroup };

    camera.position.set(2.6, 2.1, 3.4);
    camera.lookAt(0, 0, 0);

    let raf;
    let t = 0;
    const clock = new THREE.Clock();
    let visible = true;
    const onVis = () => {
      visible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVis);

    function animate() {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      const dt = clock.getDelta();
      t += dt;

      root.rotation.y = Math.sin(t * 0.18) * 0.35 + 0.15;

      pivot.rotation.z = (Math.sin(t * 0.8) * 0.5 + 0.5) * -1.1;

      tool.position.y = 0.5 + Math.sin(t * 1.6) * 0.18;
      collar.position.y = tool.position.y + 0.5;

      const sx = Math.sin(t * 1.1) * 0.7;
      beam.position.x = sx;
      beamGlow.position.set(sx, 0.05, 0);

      renderer.render(scene, camera);
    }
    animate();
    setTimeout(() => setReady(true), 200);

    const ro = new ResizeObserver(() => fitToParent(renderer, camera, canvas));
    ro.observe(wrapRef.current);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      renderer.dispose();
    };
  }, [webgl]);

  useEffect(() => {
    const g = groupsRef.current;
    if (!g.sheet) return;
    g.sheet.visible = active === 'sheet';
    g.cnc.visible = active === 'cnc';
    g.laser.visible = active === 'laser';
  }, [active]);

  return (
    <div ref={wrapRef} className="relative w-full h-72 md:h-80 rounded-sm overflow-hidden bg-[var(--bg-panel-2)] corner-brackets">
      {webgl ? (
        <canvas ref={canvasRef} className="w-full h-full" />
      ) : (
        <div className="absolute inset-0 skeleton-fallback flex items-center justify-center px-6 text-center">
          <p className="text-[var(--text-dim)] text-sm font-mono-data">3D preview unavailable — WebGL not supported on this device.</p>
        </div>
      )}
      {webgl && !ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-panel-2)]">
          <span className="spinner"></span>
        </div>
      )}
    </div>
  );
}

export default function Services() {
  const [active, setActive] = useState('sheet');
  const tabs = [
    ['sheet', 'Sheet metal', 'Cutting, bending & forming'],
   // ['cnc', 'CNC machining', 'Precision milling & turning'],
    ['laser', 'Laser cutting', 'High-accuracy laser systems'],
  ];
  const details = {
    sheet: ['Cutting, bending & forming', ['Laser and punch cutting to drawing', 'Press-brake bending with repeatable tolerances', 'Welded and formed assemblies']],
    // cnc: ['Precision machining', ['Multi-axis milling and turning', 'Tight-tolerance production runs', 'Spare and replacement part machining']],
    laser: ['Laser cutting technology', ['Fine-detail cutting across metal thicknesses', 'Consistent edge quality at production speed', 'Supporting optics, lenses and consumables']],
  };
  const [heading, bullets] = details[active];

  return (
    <section id="services" className="border-t border-[var(--line)] bg-[var(--bg-panel)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <p className="font-mono-data text-xs tracking-widest text-[var(--accent)] mb-3">CAPABILITIES</p>
        <h2 className="font-display font-bold text-4xl md:text-5xl leading-[1] mb-10 max-w-xl">What runs on our floor.</h2>
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map(([key, label, sub]) => (
            <button key={key} data-active={active === key} onClick={() => setActive(key)} className="tab-btn rounded-sm px-4 py-3 text-left">
              <div className="font-display font-semibold text-base leading-none">{label}</div>
              <div className="text-xs text-[var(--text-dim)] mt-1">{sub}</div>
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <ServicesScene active={active} />
          <div>
            <h3 className="font-display font-semibold text-2xl mb-4">{heading}</h3>
            <ul className="space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-[var(--text-dim)]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0"></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
