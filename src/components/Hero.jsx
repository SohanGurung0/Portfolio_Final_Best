import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, Trail, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// ─── Skill orbs ────────────────────────────────────────────
const SKILL_ORBS = [
  { label: 'React', color: '#61dafb', pos: [2.5, 0.5, -1], size: 0.35 },
  { label: 'Java', color: '#f89820', pos: [-2.8, 0.8, -0.5], size: 0.4 },
  { label: 'Python', color: '#3776ab', pos: [0, 2.2, -1.5], size: 0.38 },
  { label: 'JavaScript', color: '#f0db4f', pos: [-1.8, -1.5, -1], size: 0.32 },
  { label: 'Three.js', color: '#ffffff', pos: [3, -1.2, -2], size: 0.3 },
  { label: 'Node.js', color: '#68a063', pos: [-3, -0.5, -2], size: 0.35 },
  { label: 'TypeScript', color: '#3178c6', pos: [1.5, -2, -1.5], size: 0.3 },
  { label: 'Docker', color: '#2496ed', pos: [-0.5, -2.5, -1], size: 0.28 },
]

function SkillOrb({ position, color, size, label, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += 0.005
    meshRef.current.rotation.y += 0.01
    const pulse = hovered ? 1 + Math.sin(state.clock.elapsedTime * 4) * 0.06 : 1
    meshRef.current.scale.setScalar(clicked ? 1.3 * pulse : hovered ? 1.15 * pulse : 1)
  })

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onClick={() => { setClicked(!clicked); onClick?.(label) }}
          onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
          onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'none' }}
        >
          <icosahedronGeometry args={[size, 1]} />
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.8 : 0.3}
            metalness={0.8}
            roughness={0.1}
            distort={hovered ? 0.4 : 0.15}
            speed={2}
          />
        </mesh>
        {/* Glow ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.3, size * 1.4, 32]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.6 : 0.15} />
        </mesh>
      </group>
    </Float>
  )
}

// ─── Central core ───────────────────────────────────────────
function CentralCore() {
  const groupRef = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.004
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.01
      innerRef.current.rotation.z += 0.007
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer rings */}
      {[1.2, 1.5, 1.8].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.4, i * 0.5, 0]}>
          <torusGeometry args={[r, 0.012, 8, 100]} />
          <meshBasicMaterial
            color={i === 0 ? '#00d4ff' : i === 1 ? '#ff2d78' : '#7c3aed'}
            transparent
            opacity={0.4 - i * 0.08}
          />
        </mesh>
      ))}
      {/* Core sphere */}
      <Sphere ref={innerRef} args={[0.5, 64, 64]}>
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.05}
          distort={0.35}
          speed={3}
        />
      </Sphere>
    </group>
  )
}

// ─── Particle field ─────────────────────────────────────────
function Particles({ count = 400 }) {
  const points = useRef()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const r = 8 + Math.random() * 4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi) - 3
    // Color variation: cyan/magenta
    const t = Math.random()
    colors[i * 3] = t < 0.5 ? 0 : 1
    colors[i * 3 + 1] = t < 0.5 ? 0.83 : 0.18
    colors[i * 3 + 2] = t < 0.5 ? 1 : 0.47
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

// ─── Camera mouse follow ─────────────────────────────────────
function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef([0, 0])

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = [
        (e.clientX / window.innerWidth - 0.5) * 2,
        -(e.clientY / window.innerHeight - 0.5) * 2,
      ]
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    camera.position.x += (mouse.current[0] * 0.8 - camera.position.x) * 0.04
    camera.position.y += (mouse.current[1] * 0.5 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── Hero ────────────────────────────────────────────────────
export default function Hero() {
  const [activeSkill, setActiveSkill] = useState(null)

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden scanlines"
      style={{ background: 'var(--cyber-bg)' }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <CameraRig />
            <ambientLight intensity={0.1} />
            <pointLight position={[5, 5, 5]} intensity={1.5} color="#00d4ff" />
            <pointLight position={[-5, -5, 3]} intensity={1} color="#ff2d78" />
            <pointLight position={[0, 0, 2]} intensity={0.5} color="#7c3aed" />

            <Stars radius={60} depth={50} count={3000} factor={3} fade speed={0.5} />
            <Particles />
            <CentralCore />

            {SKILL_ORBS.map((orb) => (
              <SkillOrb
                key={orb.label}
                position={orb.pos}
                color={orb.color}
                size={orb.size}
                label={orb.label}
                onClick={setActiveSkill}
              />
            ))}
          </Suspense>
        </Canvas>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* Gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,4,8,0.7) 100%)',
        }}
      />

      {/* Text content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start max-w-7xl mx-auto px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl"
        >
          <div className="font-mono text-sm tracking-[0.3em] mb-4" style={{ color: 'var(--cyber-accent)' }}>
            &gt; WELCOME TO MY CYBERSPACE
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black leading-none mb-6">
            <span
              className="block glitch"
              data-text="Sohan Gurung"
              style={{ color: 'var(--cyber-glow)', textShadow: '0 0 40px var(--cyber-glow)' }}
            >
              {/* ── CUSTOMIZE: Replace with your name ── */}
              Sohan Gurung
            </span>
            <span className="block text-3xl md:text-4xl font-light mt-2" style={{ color: 'rgba(224,242,254,0.8)' }}>
              Full-Stack Developer
            </span>
          </h1>

          <p className="font-body text-lg text-blue-200/60 max-w-lg mb-8 leading-relaxed">
            Building next-generation digital experiences at the intersection of
            {' '}<span style={{ color: 'var(--cyber-glow)' }}>performance</span>,
            {' '}<span style={{ color: 'var(--cyber-accent)' }}>creativity</span>, and
            {' '}<span style={{ color: 'var(--cyber-purple)' }}>innovation</span>.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.a
              href="#projects"
              onClick={e => { e.preventDefault(); document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' }) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="font-mono text-sm tracking-widest px-8 py-3 transition-all duration-300"
              style={{
                background: 'var(--cyber-glow)',
                color: 'var(--cyber-bg)',
                boxShadow: '0 0 25px var(--cyber-glow)',
              }}
            >
              VIEW WORK
            </motion.a>
            <motion.a
              href="#contact"
              onClick={e => { e.preventDefault(); document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="font-mono text-sm tracking-widest px-8 py-3 border transition-all duration-300"
              style={{
                borderColor: 'var(--cyber-accent)',
                color: 'var(--cyber-accent)',
              }}
            >
              CONTACT
            </motion.a>
          </div>
        </motion.div>

        {/* Active skill tooltip */}
        {activeSkill && (
          <motion.div
            key={activeSkill}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 font-mono text-sm px-4 py-2"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid var(--cyber-glow)',
              color: 'var(--cyber-glow)',
            }}
          >
            &gt; SELECTED: {activeSkill} — click orbs to explore skills
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs tracking-widest" style={{ color: 'rgba(0,212,255,0.4)' }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12"
          style={{ background: 'linear-gradient(to bottom, var(--cyber-glow), transparent)' }}
        />
      </motion.div>

      {/* Corner frame */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--cyber-bg))' }} />
    </section>
  )
}
