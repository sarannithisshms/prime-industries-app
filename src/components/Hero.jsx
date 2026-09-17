import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { supportsWebGL, makeRenderer, fitToParent, steelMaterial, attachOrbitControls } from '../utils/three-helpers.js';

function HeroScene() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [webgl] = useState(supportsWebGL);

  useEffect(() => {
    if (!webgl) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const renderer = makeRenderer(canvas);
    fitToParent(renderer, camera, canvas);

    scene.add(new THREE.AmbientLight(0x8aa0c0, 0.55));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);
    const rim = new THREE.DirectionalLight(0x5b7ea8, 0.5);
    rim.position.set(-6, 3, -4);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 0.14, 4.2),
      steelMaterial(0x3c4a5e, { roughness: 0.4 })
    );
    plate.position.y = -0.6;
    group.add(plate);

    const grid = new THREE.GridHelper(9, 18, 0x35455c, 0x1c2636);
    grid.position.y = -0.66;
    group.add(grid);

    const spindleGroup = new THREE.Group();
    const spindleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 1.5, 24),
      steelMaterial(0x8b95a3, { metalness: 0.9, roughness: 0.2 })
    );
    spindleBody.position.y = 1.1;
    spindleGroup.add(spindleBody);
    const spindleStripe = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.045, 12, 32),
      steelMaterial(0xf97316, { emissive: 0xf97316, emissiveIntensity: 0.35, metalness: 0.3, roughness: 0.5 })
    );
    spindleStripe.rotation.x = Math.PI / 2;
    spindleStripe.position.y = 1.55;
    spindleGroup.add(spindleStripe);
    const bit = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 0.5, 16),
      steelMaterial(0xd7dde5, { metalness: 0.85, roughness: 0.15 })
    );
    bit.position.y = 0.15;
    spindleGroup.add(bit);
    spindleGroup.position.set(-1.6, 0, -0.4);
    group.add(spindleGroup);

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.09, 10, 28), steelMaterial(0x93a1b5));
    ringA.position.set(2.1, 0.4, -0.9);
    ringA.rotation.x = Math.PI / 2.3;
    group.add(ringA);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.06, 10, 24), steelMaterial(0xf97316, { emissiveIntensity: 0 }));
    ringB.position.set(2.5, 0.55, 0.6);
    ringB.rotation.x = Math.PI / 2.6;
    group.add(ringB);

    const laserMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const laserLine = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 3.2), laserMat);
    laserLine.rotation.y = Math.PI / 2;
    laserLine.position.set(0.8, -0.52, 0);
    group.add(laserLine);
    const laserGlow = new THREE.PointLight(0xf97316, 2.2, 3.5);
    laserGlow.position.copy(laserLine.position);
    group.add(laserGlow);

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

      spindleGroup.rotation.y += dt * 1.4;
      spindleGroup.position.y = Math.sin(t * 1.2) * 0.08;

      ringA.rotation.z += dt * 0.5;
      ringB.rotation.z -= dt * 0.7;

      const sweep = Math.sin(t * 0.9) * 2.6;
      laserLine.position.x = sweep;
      laserGlow.position.x = sweep;

      group.rotation.y += dt * 0.05;

      renderer.render(scene, camera);
    }
    animate();
    const doneTimer = setTimeout(() => setReady(true), 260);

    const controls = attachOrbitControls(canvas, camera, {
      theta: 0.55,
      phi: 1.15,
      radius: 9,
      minRadius: 5,
      maxRadius: 14,
      targetY: 0,
    });

    const ro = new ResizeObserver(() => fitToParent(renderer, camera, canvas));
    ro.observe(wrapRef.current);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(doneTimer);
      controls.dispose();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      renderer.dispose();
    };
  }, [webgl]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {webgl ? (
        <>
          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]">
              <div className="flex items-center gap-3 text-[var(--text-dim)] text-sm font-mono-data">
                <span className="spinner"></span> Initializing 3D viewport…
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 skeleton-fallback flex items-center justify-center">
          <p className="text-[var(--text-dim)] text-sm max-w-xs text-center px-6 font-mono-data">
            3D preview unavailable on this device. Your browser doesn't support WebGL — the rest of the site works normally.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[var(--bg)]">
      <HeroScene />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[var(--bg)] via-transparent to-[rgba(11,19,32,0.35)]" />
      <div className="relative z-10 h-full max-w-6xl mx-auto px-5 md:px-8 flex flex-col justify-center">
        <p className="hero-fade-in font-mono-data text-xs tracking-widest text-[var(--accent)] mb-3">
          FABRICATION · CNC SUPPLY · LASER SYSTEMS
        </p>
        <h1 className="hero-fade-in delay-1 font-display font-bold leading-[0.95] text-5xl sm:text-6xl md:text-7xl max-w-2xl">
          Prime Industries
        </h1>
        <p className="hero-fade-in delay-2 mt-4 text-[var(--text-dim)] text-lg max-w-md">
          Precision sheet metal fabrication, paired with dependable supply of CNC machine spares, tooling and laser equipment.
        </p>
        <div className="hero-fade-in delay-3 mt-8 flex flex-wrap gap-4 pointer-events-auto">
          <a href="#contact" className="btn-primary px-6 py-3 rounded-sm text-sm">
            Request a quote
          </a>
          <a
            href="#services"
            className="px-6 py-3 rounded-sm text-sm border border-[var(--line)] text-[var(--text)] hover:border-[var(--steel)] transition-colors"
          >
            Explore capabilities
          </a>
        </div>
      </div>
      <div className="absolute bottom-5 right-5 z-10 text-[11px] font-mono-data text-[var(--text-dim)] hidden sm:block pointer-events-none">
        Drag to rotate · Scroll to zoom
      </div>
    </section>
  );
}
