import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import emailjs from 'emailjs-com'

// ─── EMAILJS CONFIG ───────────────────────────────────────────
// 1. Go to https://emailjs.com → Sign up (free)
// 2. Create an Email Service (Gmail / Outlook / etc.)
// 3. Create an Email Template with these variables:
//    {{from_name}}, {{from_email}}, {{message}}, {{to_name}}
// 4. Replace the values below with your actual IDs
const EMAILJS_SERVICE_ID = 'service_v7v7n3m'    // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_yfugl0f'  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY = '_KfjXOdXys7CfxwYG'     // e.g. 'abcDEFghiJKLmno'

// ─── Animated 3D background element ──────────────────────────
function ContactOrb() {
  const meshRef = useRef()
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    meshRef.current.scale.setScalar(s)
  })

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 3]} intensity={3} color="#00d4ff" />
      <pointLight position={[3, -2, 1]} intensity={2} color="#ff2d78" />
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.2, 0.35, 128, 16]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#003344"
          metalness={0.9}
          roughness={0.05}
          wireframe={false}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh>
        <torusKnotGeometry args={[1.2, 0.35, 64, 8]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.08} />
      </mesh>
    </>
  )
}

// ─── Input field ──────────────────────────────────────────────
function CyberInput({ label, name, type = 'text', textarea, value, onChange, error }) {
  const [focused, setFocused] = useState(false)

  const commonProps = {
    name,
    value,
    onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className: 'w-full bg-transparent font-mono text-sm outline-none py-3 px-4 placeholder-transparent',
    style: { color: 'var(--cyber-glow)', resize: 'none' },
    placeholder: label,
  }

  return (
    <div className="relative">
      <div
        className="relative border transition-all duration-300"
        style={{
          borderColor: error ? 'var(--cyber-accent)' : focused ? 'var(--cyber-glow)' : 'rgba(0,212,255,0.2)',
          background: focused ? 'rgba(0,212,255,0.03)' : 'rgba(0,212,255,0.01)',
          boxShadow: focused ? '0 0 20px rgba(0,212,255,0.1)' : 'none',
        }}
      >
        <label
          htmlFor={name}
          className="absolute font-mono text-xs tracking-widest transition-all duration-200 pointer-events-none"
          style={{
            top: focused || value ? '-10px' : '14px',
            left: '12px',
            fontSize: focused || value ? '10px' : '12px',
            color: error ? 'var(--cyber-accent)' : focused ? 'var(--cyber-glow)' : 'rgba(0,212,255,0.4)',
            background: focused || value ? 'var(--cyber-bg)' : 'transparent',
            padding: '0 4px',
          }}
        >
          {label}
        </label>
        {textarea ? (
          <textarea id={name} rows={5} {...commonProps} />
        ) : (
          <input id={name} type={type} {...commonProps} />
        )}
        {/* Bottom glow line */}
        <motion.div
          initial={false}
          animate={{ scaleX: focused ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, var(--cyber-glow), transparent)`,
            boxShadow: '0 0 6px var(--cyber-glow)',
            transformOrigin: 'center',
          }}
        />
      </div>
      {error && (
        <p className="font-mono text-xs mt-1" style={{ color: 'var(--cyber-accent)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Contact section ──────────────────────────────────────────
export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required'
    if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters'
    return errs
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('sending')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_name: 'Alex', // ── CUSTOMIZE: Your name
        },
        EMAILJS_PUBLIC_KEY,
      )
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
    }
  }

  // ── CUSTOMIZE: Your social links ──
  const SOCIALS = [
    { label: 'GITHUB', href: 'https://github.com/SohanGurung0', icon: '⬡' },
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/sohan-grg-263818353/', icon: '▣' },
    { label: 'FACEBOOK', href: 'https://www.facebook.com/sohan.grg.617329/', icon: '◈' },
    { label: 'EMAIL', href: 'mailto:ngrg411@email.com', icon: '✉' },
  ]

  return (
    <section id="contact" className="relative py-32" style={{ background: 'var(--cyber-bg)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 60% 40%, rgba(0,212,255,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-8 md:px-16">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="font-mono text-sm tracking-[0.3em] mb-3" style={{ color: 'var(--cyber-accent)' }}>
            &gt; 04 / CONTACT.INIT
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white">
            LET'S{' '}
            <span style={{ color: 'var(--cyber-glow)', textShadow: '0 0 20px var(--cyber-glow)' }}>
              CONNECT
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: 3D */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block h-[480px] relative"
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 2]}>
              <Suspense fallback={null}>
                <ContactOrb />
              </Suspense>
            </Canvas>

            {/* Info cards */}
            <div className="absolute bottom-0 left-0 right-0 space-y-2">
              {[
                { label: 'LOCATION', value: 'Pokhara, Nepal 🇳🇵' }, // ── CUSTOMIZE
                { label: 'AVAILABILITY', value: 'Open to opportunities' },
                { label: 'RESPONSE TIME', value: '< 24 hours' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center px-4 py-2"
                  style={{
                    background: 'rgba(0,212,255,0.04)',
                    border: '1px solid rgba(0,212,255,0.1)',
                  }}
                >
                  <span className="font-mono text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>{label}</span>
                  <span className="font-mono text-xs" style={{ color: 'rgba(224,242,254,0.7)' }}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="cyber-panel p-12 text-center"
                >
                  <div
                    className="font-display text-6xl mb-4"
                    style={{ color: 'var(--cyber-green)', textShadow: '0 0 30px var(--cyber-green)' }}
                  >
                    ✓
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 text-white">MESSAGE SENT</h3>
                  <p className="font-mono text-sm" style={{ color: 'rgba(0,212,255,0.6)' }}>
                    Transmission received. I'll respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 font-mono text-xs px-6 py-2 border transition-all"
                    style={{ borderColor: 'var(--cyber-green)', color: 'var(--cyber-green)' }}
                  >
                    SEND ANOTHER
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  noValidate
                >
                  <CyberInput
                    label="YOUR_NAME"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                  <CyberInput
                    label="YOUR_EMAIL"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                  <CyberInput
                    label="MESSAGE"
                    name="message"
                    textarea
                    value={form.message}
                    onChange={handleChange}
                    error={errors.message}
                  />

                  {status === 'error' && (
                    <div
                      className="font-mono text-xs px-4 py-3"
                      style={{
                        background: 'rgba(255,45,120,0.08)',
                        border: '1px solid rgba(255,45,120,0.3)',
                        color: 'var(--cyber-accent)',
                      }}
                    >
                      &gt; TRANSMISSION FAILED — check EmailJS config and try again
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full font-mono text-sm tracking-widest py-4 transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: status === 'sending'
                        ? 'rgba(0,212,255,0.3)'
                        : 'var(--cyber-glow)',
                      color: 'var(--cyber-bg)',
                      boxShadow: status !== 'sending' ? '0 0 25px rgba(0,212,255,0.4)' : 'none',
                    }}
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center justify-center gap-3">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block"
                        >
                          ◌
                        </motion.span>
                        TRANSMITTING...
                      </span>
                    ) : (
                      'SEND MESSAGE ↗'
                    )}
                  </motion.button>

                  {/* Socials */}
                  <div
                    className="pt-6 border-t"
                    style={{ borderColor: 'rgba(0,212,255,0.1)' }}
                  >
                    <div className="font-mono text-xs mb-4" style={{ color: 'rgba(0,212,255,0.3)' }}>
                      OR FIND ME ON
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {SOCIALS.map(({ label, href, icon }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 font-mono text-xs px-4 py-2 border transition-all hover:scale-105 duration-200"
                          style={{
                            borderColor: 'rgba(0,212,255,0.2)',
                            color: 'rgba(0,212,255,0.6)',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--cyber-glow)'
                            e.currentTarget.style.color = 'var(--cyber-glow)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'
                            e.currentTarget.style.color = 'rgba(0,212,255,0.6)'
                          }}
                        >
                          <span>{icon}</span>
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
