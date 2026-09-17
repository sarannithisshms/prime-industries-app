import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-10">
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display font-semibold tracking-wide">
          PRIME <span style={{ color: 'var(--accent)' }}>INDUSTRIES</span>
        </p>
        <p className="text-xs text-[var(--text-dim)]">Sheet metal fabrication · CNC spares & tooling · Laser equipment</p>
        <p className="text-xs text-[var(--text-dim)]">© {new Date().getFullYear()} Prime Industries</p>
      </div>
    </footer>
  );
}
