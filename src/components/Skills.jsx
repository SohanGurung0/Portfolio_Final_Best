import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as THREE from 'three'

// ─── CUSTOMIZE: Update skills here ───────────────────────────
const SKILLS = [
  // Languages
  { name: 'Java', icon: '☕', level: 60, color: '#f89820', category: 'Language' },
  { name: 'Python', icon: '🐍', level: 80, color: '#3776ab', category: 'Language' },
  { name: 'JavaScript', icon: 'JS', level: 75, color: '#f0db4f', category: 'Language' },
  //{ name: 'TypeScript', icon: 'TS', level: 78, color: '#3178c6', category: 'Language' },
  { name: 'SQL', icon: '⛁', level: 65, color: '#336791', category: 'Language' },
  // Frontend
  { name: 'React', icon: '⚛', level: 70, color: '#61dafb', category: 'Frontend' },
  { name: 'Three.js', icon: '▲', level: 60, color: '#ffffff', category: 'Frontend' },
  { name: 'CSS/Tailwind', icon: '🎨', level: 70, color: '#38bdf8', category: 'Frontend' },
  // Backend
  { name: 'Node.js', icon: '⬡', level: 70, color: '#68a063', category: 'Backend' },
  { name: 'Spring Boot', icon: '🌱', level: 60, color: '#6db33f', category: 'Backend' },
  //{ name: 'FastAPI', icon: '⚡', level: 72, color: '#009688', category: 'Backend' },
  // DevOps
  //{ name: 'Docker', icon: '🐳', level: 75, color: '#2496ed', category: 'DevOps' },
  //{ name: 'AWS', icon: '☁️', level: 80, color: '#ff9900', category: 'DevOps' },
  //{ name: 'CI/CD', icon: '♾', level: 72, color: '#00d4ff', category: 'DevOps' },
]

// ─── 3D Orbiting skill balls ──────────────────────────────────
function OrbitalRing({ skills, radius, speed, tiltX, tiltZ }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += speed
    }
  })

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      {/* Ring guide */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.008, 8, 100]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} />
      </mesh>
      <group ref={groupRef}>
        {skills.map((skill, i) => {
          const angle = (i / skills.length) * Math.PI * 2
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const isHov = hovered === skill.name

          return (
            <group key={skill.name} position={[x, 0, z]}>
              <mesh
                onPointerEnter={() => setHovered(skill.name)}
                onPointerLeave={() => setHovered(null)}
              >
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshStandardMaterial
                  color={skill.color}
                  emissive={skill.color}
                  emissiveIntensity={isHov ? 0.9 : 0.3}
                  metalness={0.8}
                  roughness={0.1}
                />
              </mesh>
            </group>
          )
        })}
      </group>
    </group>
  )
}

function SkillsScene() {
  const byCategory = {
    Language: SKILLS.filter(s => s.category === 'Language'),
    Frontend: SKILLS.filter(s => s.category === 'Frontend'),
    Backend: SKILLS.filter(s => s.category === 'Backend')
    // DevOps: SKILLS.filter(s => s.category === 'DevOps'),
  }

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#00d4ff" />
      <pointLight position={[5, -3, 0]} intensity={1} color="#ff2d78" />
      <pointLight position={[-5, 0, 3]} intensity={1} color="#7c3aed" />

      {/* Core */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} metalness={1} roughness={0} />
      </mesh>

      <OrbitalRing skills={byCategory.Language} radius={1.4} speed={0.006} tiltX={0.3} tiltZ={0} />
      <OrbitalRing skills={byCategory.Frontend} radius={2.0} speed={-0.004} tiltX={0.5} tiltZ={0.2} />
      <OrbitalRing skills={byCategory.Backend} radius={2.6} speed={0.003} tiltX={-0.3} tiltZ={0.4} />
      {/* <OrbitalRing skills={byCategory.DevOps} radius={3.2} speed={-0.005} tiltX={0.1} tiltZ={-0.3} />*/}
    </>
  )
}

// ─── Skill card ───────────────────────────────────────────────
function SkillCard({ skill, delay }) {
  const [ref, inView] = useInView({ triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="cyber-panel p-4 group cursor-default"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{skill.icon}</span>
          <span className="font-mono text-sm" style={{ color: skill.color }}>
            {skill.name}
          </span>
        </div>
        <span className="font-mono text-xs" style={{ color: 'rgba(0,212,255,0.4)' }}>
          {skill.level}%
        </span>
      </div>
      <div className="w-full h-px" style={{ background: 'rgba(0,212,255,0.1)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
          className="h-full"
          style={{
            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
            boxShadow: `0 0 6px ${skill.color}`,
          }}
        />
      </div>
      <div className="mt-2 font-mono text-xs" style={{ color: 'rgba(0,212,255,0.3)' }}>
        {skill.category}
      </div>
    </motion.div>
  )
}

// ─── Skills section ───────────────────────────────────────────
export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [filter, setFilter] = useState('All')
  const categories = ['All', 'Language', 'Frontend', 'Backend']
  const filtered = filter === 'All' ? SKILLS : SKILLS.filter(s => s.category === filter)

  return (
    <section id="skills" className="relative py-32" style={{ background: 'var(--cyber-bg)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)',
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
            &gt; 02 / SKILLS.EXE
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white">
            TECH{' '}
            <span style={{ color: 'var(--cyber-glow)', textShadow: '0 0 20px var(--cyber-glow)' }}>
              ARSENAL
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* 3D orbital */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-96 lg:h-[520px] relative"
          >
            <Canvas camera={{ position: [0, 2, 7], fov: 60 }} dpr={[1, 2]}>
              <Suspense fallback={null}>
                <SkillsScene />
              </Suspense>
            </Canvas>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-center"
              style={{ color: 'rgba(0,212,255,0.3)' }}>
              ORBITAL SKILL MAP — LIVE
            </div>
          </motion.div>

          {/* Skill cards */}
          <div>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="font-mono text-xs px-4 py-2 transition-all duration-200"
                  style={{
                    background: filter === cat ? 'var(--cyber-glow)' : 'rgba(0,212,255,0.05)',
                    border: `1px solid ${filter === cat ? 'var(--cyber-glow)' : 'rgba(0,212,255,0.2)'}`,
                    color: filter === cat ? 'var(--cyber-bg)' : 'var(--cyber-glow)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--cyber-glow) transparent',
            }}>
              {filtered.map((skill, i) => (
                <SkillCard key={skill.name} skill={skill} delay={i * 0.06} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
