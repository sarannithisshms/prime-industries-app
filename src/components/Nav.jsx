import React, { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    ['Home', '#home'],
    ['About', '#about'],
    ['Services', '#services'],
    ['Products', '#products'],
    ['Contact', '#contact'],
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-[rgba(11,19,32,0.82)] border-b border-[var(--line)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="font-display text-xl font-bold tracking-wide">
          PRIME <span style={{ color: 'var(--accent)' }}>INDUSTRIES</span>
        </a>
        <nav className="hidden md:flex gap-8 text-sm text-[var(--text-dim)]">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="nav-link hover:text-[var(--text)] transition-colors">
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden md:inline-block btn-primary text-sm px-4 py-2 rounded-sm">
          Request a quote
        </a>
        <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="md:hidden text-[var(--text)] p-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[var(--bg-panel)] border-t border-[var(--line)] px-5 py-4 flex flex-col gap-4">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="text-[var(--text-dim)] text-sm">
              {label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="btn-primary text-sm px-4 py-2 rounded-sm text-center">
            Request a quote
          </a>
        </div>
      )}
    </header>
  );
}
