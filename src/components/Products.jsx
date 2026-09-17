import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { supportsWebGL, makeRenderer, fitToParent, steelMaterial } from '../utils/three-helpers.js';

function ProductViewer({ kind }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [webgl] = useState(supportsWebGL);

  useEffect(() => {
    if (!webgl) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(1.8, 1.4, 2.4);
    camera.lookAt(0, 0, 0);
    const renderer = makeRenderer(canvas);
    fitToParent(renderer, camera, canvas);

    scene.add(new THREE.AmbientLight(0x8aa0c0, 0.65));
    const dl = new THREE.DirectionalLight(0xffffff, 1.05);
    dl.position.set(3, 4, 3);
    scene.add(dl);

    let mesh;
    if (kind === 'spares') {
      mesh = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.22, 16, 36), steelMaterial(0x93a1b5, { metalness: 0.85, roughness: 0.2 }));
    } else if (kind === 'tools') {
      mesh = new THREE.Group();
      const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.0, 20), steelMaterial(0xd7dde5, { metalness: 0.9, roughness: 0.15 }));
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.5, 20), steelMaterial(0xf97316, { emissive: 0xf97316, emissiveIntensity: 0.15, metalness: 0.5 }));
      tip.position.y = -0.75;
      mesh.add(shank, tip);
    } else if (kind === 'laser') {
      mesh = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(0.9, 0.14, 0.5),
          steelMaterial(i === 1 ? 0xf97316 : 0x3c4a5e, { metalness: 0.6, roughness: 0.3, emissive: i === 1 ? 0xf97316 : 0x000000, emissiveIntensity: i === 1 ? 0.2 : 0 })
        );
        b.position.y = i * 0.22 - 0.22;
        mesh.add(b);
      }
    } else {
      mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 0), steelMaterial(0x8b95a3, { metalness: 0.7, roughness: 0.28 }));
    }
    scene.add(mesh);

    let raf;
    let t = 0;
    let paused = false;
    const clock = new THREE.Clock();
    function animate() {
      raf = requestAnimationFrame(animate);
      if (paused) return;
      const dt = clock.getDelta();
      t += dt;
      mesh.rotation.y += dt * 0.7;
      mesh.rotation.x = Math.sin(t * 0.5) * 0.15;
      renderer.render(scene, camera);
    }
    animate();

    const io = new IntersectionObserver(
      (entries) => {
        paused = !entries[0].isIntersecting;
      },
      { threshold: 0.15 }
    );
    io.observe(wrapRef.current);

    const ro = new ResizeObserver(() => fitToParent(renderer, camera, canvas));
    ro.observe(wrapRef.current);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      renderer.dispose();
    };
  }, [webgl, kind]);

  return (
    <div ref={wrapRef} className="w-full h-36 bg-[var(--bg-panel-2)]">
      {webgl ? <canvas ref={canvasRef} className="w-full h-full" /> : <div className="w-full h-full skeleton-fallback"></div>}
    </div>
  );
}

export default function Products() {
  const items = [
    ['spares', 'CNC machine spares', 'Bearings, bushings & drive components', 'SPEC: ISO-fit tolerance'],
    ['tools', 'Cutting tools', 'End mills, drills & indexable inserts', 'SPEC: Carbide & HSS'],
    ['laser', 'Laser components', 'Lenses, nozzles & optic assemblies', 'SPEC: CO₂ / fiber compatible'],
    ['part', 'Precision spare parts', 'Machined replacements to drawing', 'SPEC: ±0.02mm tolerance'],
  ];

  return (
    <section id="products" className="border-t border-[var(--line)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-mono-data text-xs tracking-widest text-[var(--accent)] mb-3">CATALOG PREVIEW</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl leading-[1] max-w-lg">Spares, tooling and laser equipment.</h2>
          </div>
          <a href="#contact" className="text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors border-b border-[var(--line)] hover:border-[var(--steel)] pb-0.5">
            Ask about full catalog
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(([kind, name, desc, spec]) => (
            <div key={kind} className="product-card rounded-sm overflow-hidden">
              <ProductViewer kind={kind} />
              <div className="p-4">
                <h3 className="font-display font-semibold text-lg leading-tight">{name}</h3>
                <p className="text-xs text-[var(--text-dim)] mt-1 mb-3">{desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono-data text-[10px] text-[var(--steel-light)]">{spec}</span>
                  <a href="#contact" className="text-xs text-[var(--accent)] hover:text-[#FB923C]">
                    Enquire
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
