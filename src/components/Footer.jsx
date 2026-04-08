import React from 'react'
import { motion } from 'framer-motion'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative py-12 border-t"
      style={{
        background: 'var(--cyber-surface)',
        borderColor: 'rgba(0,212,255,0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div
            className="font-display text-2xl font-black tracking-widest"
            style={{ color: 'var(--cyber-glow)', textShadow: '0 0 10px var(--cyber-glow)' }}
          >
            Sohan<span style={{ color: 'var(--cyber-accent)' }}>.</span>IO
          </div>

          {/* Copy */}
          <div className="font-mono text-xs text-center" style={{ color: 'rgba(0,212,255,0.3)' }}>
            © {year} Sohan Gurung — BUILT WITH REACT + THREE.JS + ❤️
            {/* ── CUSTOMIZE: Your name ── */}
          </div>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-xs px-4 py-2 border transition-all hover:scale-105"
            style={{
              borderColor: 'rgba(0,212,255,0.2)',
              color: 'rgba(0,212,255,0.5)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--cyber-glow)'
              e.currentTarget.style.color = 'var(--cyber-glow)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'
              e.currentTarget.style.color = 'rgba(0,212,255,0.5)'
            }}
          >
            ↑ TOP
          </button>
        </div>

        {/* Bottom status bar */}
        <div
          className="mt-8 pt-6 border-t flex items-center justify-between flex-wrap gap-3"
          style={{ borderColor: 'rgba(0,212,255,0.05)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--cyber-green)', boxShadow: '0 0 6px var(--cyber-green)' }}
            />
            <span className="font-mono text-xs" style={{ color: 'rgba(0,212,255,0.3)' }}>
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
          <span className="font-mono text-xs" style={{ color: 'rgba(0,212,255,0.2)' }}>
            v1.0.0 — Sohan Gurung PORTFOLIO
          </span>
        </div>
      </div>
    </footer>
  )
}
