import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// ─── 3D Avatar/particle cluster ──────────────────────────────
function AvatarSphere() {
  const meshRef = useRef()
  const ring1 = useRef()
  const ring2 = useRef()
  const ring3 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
    if (ring1.current) ring1.current.rotation.z = t * 0.4
    if (ring2.current) ring2.current.rotation.x = t * 0.3
    if (ring3.current) ring3.current.rotation.y = t * 0.5
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group>
        {/* Core avatar */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#00d4ff"
            emissive="#0066aa"
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.1}
            distort={0.25}
            speed={2}
          />
        </mesh>

        {/* Orbital rings */}
        {[
          { ref: ring1, r: 1.5, tube: 0.015, rot: [0.5, 0, 0], color: '#00d4ff' },
          { ref: ring2, r: 1.8, tube: 0.01, rot: [1.0, 0.5, 0], color: '#ff2d78' },
          { ref: ring3, r: 2.1, tube: 0.008, rot: [0.2, 1.2, 0], color: '#7c3aed' },
        ].map(({ ref, r, tube, rot, color }, i) => (
          <mesh key={i} ref={ref} rotation={rot}>
            <torusGeometry args={[r, tube, 8, 80]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
          </mesh>
        ))}

        {/* Data nodes on surface */}
        {Array.from({ length: 12 }).map((_, i) => {
          const phi = Math.acos(-1 + (2 * i) / 12)
          const theta = Math.sqrt(12 * Math.PI) * phi
          return (
            <mesh
              key={i}
              position={[
                1.05 * Math.cos(theta) * Math.sin(phi),
                1.05 * Math.sin(theta) * Math.sin(phi),
                1.05 * Math.cos(phi),
              ]}
            >
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial
                color={i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#ff2d78' : '#ffd700'}
              />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

// ─── Stat item ───────────────────────────────────────────────
function Stat({ value, label, delay }) {
  const [ref, inView] = useInView({ triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div
        className="font-display text-4xl font-black mb-1"
        style={{ color: 'var(--cyber-glow)', textShadow: '0 0 20px var(--cyber-glow)' }}
      >
        {value}
      </div>
      <div className="font-mono text-xs tracking-widest" style={{ color: 'rgba(0,212,255,0.5)' }}>
        {label}
      </div>
    </motion.div>
  )
}

// ─── About section ───────────────────────────────────────────
export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section
      id="about"
      className="relative py-32 overflow-hidden cyber-grid"
      style={{ background: 'var(--cyber-surface)' }}
    >
      {/* Glow blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'var(--cyber-glow)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'var(--cyber-accent)' }}
      />

      <div className="max-w-7xl mx-auto px-8 md:px-16">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="font-mono text-sm tracking-[0.3em] mb-3" style={{ color: 'var(--cyber-accent)' }}>
            &gt; 01 / ABOUT_ME
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black" style={{ color: 'white' }}>
            WHO AM{' '}
            <span style={{ color: 'var(--cyber-glow)', textShadow: '0 0 20px var(--cyber-glow)' }}>
              I
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: 3D canvas */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-80 md:h-[480px] relative"
          >
            <Canvas camera={{ position: [0, 0, 4.5], fov: 55 }} dpr={[1, 2]}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.2} />
                <pointLight position={[5, 5, 5]} intensity={2} color="#00d4ff" />
                <pointLight position={[-5, -3, 2]} intensity={1.5} color="#ff2d78" />
                <AvatarSphere />
              </Suspense>
            </Canvas>
            {/* Overlay label */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest px-4 py-1.5"
              style={{
                background: 'rgba(0,212,255,0.08)',
                border: '1px solid rgba(0,212,255,0.25)',
                color: 'var(--cyber-glow)',
              }}
            >
              DIGITAL AVATAR / ONLINE
            </div>
          </motion.div>

          {/* Right: bio + stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            {/* ── CUSTOMIZE: Update bio text ── */}
            <div className="space-y-4">
              <p className="font-body text-lg leading-relaxed" style={{ color: 'rgba(224,242,254,0.8)' }}>
                I'm Sohan Gurung.{' '}
                <span style={{ color: 'var(--cyber-glow)' }}>A full-stack developer</span>
                {' '}passionate about crafting high-performance web applications .Im currently a undergrad studying CS , I specialize in building scalable systems and beautiful interfaces.
              </p>
              <p className="font-body text-lg leading-relaxed" style={{ color: 'rgba(224,242,254,0.6)' }}>
                When I'm not pushing pixels, I'm exploring the intersection of{' '}
                <span style={{ color: 'var(--cyber-accent)' }}>AI & web tech</span>,
                {' '}contributing to open-source, and spending my time playing video games and painting.
              </p>
            </div>

            {/* Stats grid */}
            <div
              className="grid grid-cols-3 gap-6 py-8 border-y"
              style={{ borderColor: 'rgba(0,212,255,0.1)' }}
            >
              {/* ── CUSTOMIZE: Update stats ──
              <Stat value="" label="YEARS EXP" delay={0.4} />*/}
              <Stat value="5+" label="PROJECTS" delay={0.4} />
              <Stat value="100%" label="UPTIME" delay={0.5} />
              <Stat value="100%" label="Energy" delay={0.6} />
            </div>

            {/* Tech stack chips */}
            <div>
              <div className="font-mono text-xs tracking-widest mb-3" style={{ color: 'rgba(0,212,255,0.4)' }}>
                CORE STACK
              </div>
              <div className="flex flex-wrap gap-2">
                {/* ── CUSTOMIZE: Update tech stack ── */}
                {['Java', 'Python', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript'].map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-3 py-1.5 skill-badge"
                    style={{ color: 'var(--cyber-glow)' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Download CV */}
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-3 font-mono text-sm tracking-widest px-6 py-3 border transition-all duration-300 group"
              style={{ borderColor: 'rgba(0,212,255,0.3)', color: 'rgba(0,212,255,0.7)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--cyber-glow)'
                e.currentTarget.style.color = 'var(--cyber-glow)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'
                e.currentTarget.style.color = 'rgba(0,212,255,0.7)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span>↓</span>
              DOWNLOAD_RESUME.PDF
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
