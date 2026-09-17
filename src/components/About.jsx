import React from 'react';

export default function About() {
  const stats = [
    ['01', 'Custom fabrication', 'Sheet metal parts cut, bent and formed to spec, from prototype runs to production volume.'],
    ['02', 'Precision manufacturing', 'CNC-machined components held to tight tolerances for repeatable, production-grade quality.'],
    ['03', 'CNC spares & tooling', 'Ongoing supply of machine spares, cutting tools and wear parts to keep production lines running.'],
    ['04', 'Laser systems', 'Specialists in laser cutting technology and the equipment that supports it, from optics to consumables.'],
  ];

  return (
    <section id="about" className="relative bp-grid border-t border-[var(--line)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12">
        <div>
          <p className="font-mono-data text-xs tracking-widest text-[var(--accent)] mb-3">ABOUT PRIME INDUSTRIES</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl leading-[1] mb-6">
            Two disciplines,
            <br />
            one production floor.
          </h2>
          <p className="text-[var(--text-dim)] leading-relaxed max-w-md">
            Prime Industries operates at the intersection of custom fabrication and machine supply —
            producing sheet metal parts to order while keeping fabrication shops and production lines
            stocked with the CNC spares, tools and laser machine equipment they depend on. That dual
            focus means the people building your parts also understand the machines that build them.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)]">
          {stats.map(([num, title, body]) => (
            <div key={num} className="bg-[var(--bg)] p-6">
              <span className="font-mono-data text-xs text-[var(--accent)]">{num}</span>
              <h3 className="font-display font-semibold text-xl mt-2 mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
