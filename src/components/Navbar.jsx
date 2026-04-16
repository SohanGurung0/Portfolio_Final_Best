import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'HOME', href: '#hero' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('HOME')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)

      // Detect which section is currently in view
      const offsets = navLinks.map(({ label, href }) => {
        const el = document.querySelector(href)
        if (!el) return { label, top: Infinity }
        return { label, top: el.getBoundingClientRect().top }
      })

      // Find the last section whose top is at or above the middle of the viewport
      const mid = window.innerHeight / 2
      const visible = offsets.filter(o => o.top <= mid)
      if (visible.length > 0) {
        setActive(visible[visible.length - 1].label)
      } else {
        setActive('HOME')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // run once on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href, label) => {
    setActive(label)
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
      <>
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                scrolled ? 'py-3' : 'py-5'
            }`}
            style={{
              background: scrolled
                  ? 'rgba(2, 4, 8, 0.95)'
                  : 'transparent',
              backdropFilter: scrolled ? 'blur(20px)' : 'none',
              borderBottom: scrolled ? '1px solid rgba(0,212,255,0.1)' : 'none',
            }}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            {/* Logo */}
            {/* Logo and Profile Pic Section */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 blur transition duration-300" style={{ background: 'var(--cyber-glow)' }}></div>
                  <img
                    src="/Images/profile.jpeg"
                    alt="Sohan Gurung"
                    className="relative w-10 h-10 rounded-full object-cover border-2 transition-transform duration-300 group-hover:scale-105"
                    style={{ borderColor: 'var(--cyber-glow)' }}
                    />
                  </div>
                    <button
                       onClick={() => handleNav('#hero', 'HOME')}
                          className="font-display text-xl font-black tracking-widest hidden sm:block"
                            style={{ color: 'var(--cyber-glow)', textShadow: '0 0 15px var(--cyber-glow)' }}
                                aria-label="Go to top">
                    Sohan<span style={{ color: 'var(--cyber-accent)' }}>.</span>IO
                  </button>
              </div>


            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
              {navLinks.map(({ label, href }) => (
                  <li key={label}>
                    <button
                        onClick={() => handleNav(href, label)}
                        className="font-mono text-xs tracking-widest transition-all duration-300 relative group"
                        style={{
                          color: active === label ? 'var(--cyber-glow)' : 'rgba(224,242,254,0.5)',
                        }}
                        aria-current={active === label ? 'page' : undefined}
                    >
                      {active === label && (
                          <motion.span
                              layoutId="nav-indicator"
                              className="absolute -bottom-1 left-0 right-0 h-px"
                              style={{
                                background: 'var(--cyber-glow)',
                                boxShadow: '0 0 6px var(--cyber-glow)',
                              }}
                          />
                      )}
                      <span className="group-hover:text-white transition-colors">{label}</span>
                    </button>
                  </li>
              ))}
            </ul>

            {/* CTA */}
            <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNav('#contact', 'CONTACT') }}
                className="hidden md:block font-mono text-xs tracking-widest px-5 py-2 border transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: 'var(--cyber-glow)',
                  color: 'var(--cyber-glow)',
                  boxShadow: '0 0 10px rgba(0,212,255,0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--cyber-glow)'
                  e.currentTarget.style.color = 'var(--cyber-bg)'
                  e.currentTarget.style.boxShadow = '0 0 20px var(--cyber-glow)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--cyber-glow)'
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0,212,255,0.2)'
                }}
            >
              HIRE ME
            </a>

            {/* Mobile hamburger */}
            <button
                className="md:hidden flex flex-col gap-1.5 p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
            >
              {[0, 1, 2].map(i => (
                  <motion.div
                      key={i}
                      className="w-6 h-px"
                      style={{ background: 'var(--cyber-glow)' }}
                      animate={
                        mobileOpen
                            ? i === 0 ? { rotate: 45, y: 5 } : i === 2 ? { rotate: -45, y: -5 } : { opacity: 0 }
                            : { rotate: 0, y: 0, opacity: 1 }
                      }
                  />
              ))}
            </button>
          </div>
        </motion.nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
              <motion.div
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-10 md:hidden"
                  style={{ background: 'rgba(2,4,8,0.98)', backdropFilter: 'blur(20px)' }}
              >
                {navLinks.map(({ label, href }, i) => (
                    <motion.button
                        key={label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => handleNav(href, label)}
                        className="font-display text-2xl font-bold tracking-widest"
                        style={{ color: active === label ? 'var(--cyber-glow)' : 'rgba(224,242,254,0.6)' }}
                    >
                      {label}
                    </motion.button>
                ))}
              </motion.div>
          )}
        </AnimatePresence>
      </>
  )
}
