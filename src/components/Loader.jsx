import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Loader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100 }
        return prev + Math.random() * 15
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const lines = [
    '> INITIALIZING NEURAL INTERFACE...',
    '> LOADING 3D RENDER ENGINE...',
    '> CALIBRATING HOLOGRAPHIC MATRIX...',
    '> ESTABLISHING CYBERSPACE CONNECTION...',
    '> SYSTEM ONLINE',
  ]

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'var(--cyber-bg)' }}
    >
      {/* Grid bg */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-lg px-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div
            className="font-display text-5xl font-black tracking-widest mb-2"
            style={{ color: 'var(--cyber-glow)', textShadow: '0 0 30px var(--cyber-glow)' }}
          >
            NEURAL
          </div>
          <div
            className="font-mono text-sm tracking-[0.5em] uppercase"
            style={{ color: 'var(--cyber-accent)' }}
          >
            .DEV PORTFOLIO
          </div>
        </motion.div>

        {/* Animated hex ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 relative"
        >
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <polygon
              points="40,5 70,22.5 70,57.5 40,75 10,57.5 10,22.5"
              fill="none"
              stroke="var(--cyber-glow)"
              strokeWidth="1"
              style={{ filter: 'drop-shadow(0 0 4px var(--cyber-glow))' }}
            />
            <polygon
              points="40,15 62,27.5 62,52.5 40,65 18,52.5 18,27.5"
              fill="none"
              stroke="var(--cyber-accent)"
              strokeWidth="0.5"
              style={{ filter: 'drop-shadow(0 0 4px var(--cyber-accent))' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: 'var(--cyber-glow)', boxShadow: '0 0 10px var(--cyber-glow)' }}
            />
          </div>
        </motion.div>

        {/* Terminal lines */}
        <div className="w-full font-mono text-xs space-y-1">
          {lines.map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 + 0.4 }}
              style={{ color: i === lines.length - 1 ? 'var(--cyber-green)' : 'rgba(0,212,255,0.6)' }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between font-mono text-xs mb-2" style={{ color: 'rgba(0,212,255,0.5)' }}>
            <span>LOADING</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="w-full h-px bg-cyber-border relative overflow-hidden rounded">
            <motion.div
              className="h-full rounded"
              style={{
                width: `${Math.min(100, progress)}%`,
                background: 'linear-gradient(90deg, var(--cyber-glow), var(--cyber-accent))',
                boxShadow: '0 0 8px var(--cyber-glow)',
                transition: 'width 0.1s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos) => (
        <div key={pos} className={`absolute ${pos} w-8 h-8`}>
          <div className="w-full h-px bg-cyber-glow opacity-40" style={{ background: 'var(--cyber-glow)' }} />
          <div className="h-full w-px bg-cyber-glow opacity-40" style={{ background: 'var(--cyber-glow)' }} />
        </div>
      ))}
    </motion.div>
  )
}
