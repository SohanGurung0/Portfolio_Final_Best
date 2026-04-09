import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// ─── CUSTOMIZE: Replace with your real projects ───────────────
const PROJECTS = [
  {
    id: 1,
    title: 'TicTacToe',
    subtitle: 'Online tictactoe Platform',
    description:
      'Full-stack platform with proper backend integration like auth,login etc ',
    tags: ['React', 'Java Spring', 'mysql'],
    color: '#00d4ff',
    accentColor: '#7c3aed',
    // Replace src with actual screenshots or use placeholder colors
    gradient: 'linear-gradient(135deg, #020c1b 0%, #0a1628 50%, #071020 100%)',
    liveUrl: 'None',
    githubUrl: 'https://github.com/SohanGurung0/tictactoe',
    stats: { stars: '0', forks: '0', commits: '3' },
    featured: true,
  },
  {
    id: 2,
    title: 'Gokyo bistro',
    subtitle: 'A online platform for a virtual resturant',
    description:
      ' A proper online web for a resturant with booking, payment, register features',
    tags: ['React', 'Java', 'SpringBoot', 'Postgresql', 'Docker'],
    color: '#ff2d78',
    accentColor: '#ff9900',
    gradient: 'linear-gradient(135deg, #1a0410 0%, #2d0820 50%, #1a0410 100%)',
    liveUrl: 'https://gokyo-bistro0.vercel.app/',
    githubUrl: 'https://github.com/SohanGurung0/GokyoBistro0',
    stats: { stars: '1', forks: '0', commits: '2' },
    featured: true,
  }/*,
  {
    id: 3,
    title: 'QUANTUM API',
    subtitle: 'High-Performance REST Framework',
    description:
      'Python FastAPI microservice framework with auto-generated docs, JWT auth, rate limiting, and Redis caching. Handles 10k+ req/sec.',
    tags: ['Python', 'FastAPI', 'Redis', 'Docker', 'PostgreSQL'],
    color: '#00ff88',
    accentColor: '#3776ab',
    gradient: 'linear-gradient(135deg, #001a0d 0%, #002918 50%, #001a0d 100%)',
    liveUrl: 'https://your-live-demo.com',
    githubUrl: 'https://github.com/yourusername/quantum-api',
    stats: { stars: '420', forks: '78', commits: '315' },
    featured: false,
  },
  {
    id: 4,
    title: 'VOID COLLAB',
    subtitle: 'Real-Time Collaborative IDE',
    description:
      'Browser-based collaborative code editor with operational transforms, syntax highlighting for 40+ languages, live cursors, and AI code suggestions.',
    tags: ['React', 'WebSocket', 'Node.js', 'CodeMirror', 'OpenAI'],
    color: '#ffd700',
    accentColor: '#ff2d78',
    gradient: 'linear-gradient(135deg, #1a1400 0%, #2d2000 50%, #1a1400 100%)',
    liveUrl: 'https://your-live-demo.com',
    githubUrl: 'https://github.com/yourusername/void-collab',
    stats: { stars: '2.1k', forks: '389', commits: '1.2k' },
    featured: true,
  },
  {
    id: 5,
    title: 'MATRIX CHAIN',
    subtitle: 'Blockchain Portfolio Tracker',
    description:
      'Multi-chain portfolio tracker supporting 15+ networks with DeFi positions, NFT gallery, P&L tracking, and tax reporting exports.',
    tags: ['React', 'TypeScript', 'Ethers.js', 'Node.js', 'MongoDB'],
    color: '#7c3aed',
    accentColor: '#00d4ff',
    gradient: 'linear-gradient(135deg, #0d0520 0%, #150a35 50%, #0d0520 100%)',
    liveUrl: 'https://your-live-demo.com',
    githubUrl: 'https://github.com/yourusername/matrix-chain',
    stats: { stars: '540', forks: '92', commits: '478' },
    featured: false,
  },*/
]

// ─── Project card ─────────────────────────────────────────────
function ProjectCard({ project, index, onSelect }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20
    cardRef.current.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)'
    }
    setHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="relative"
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cyber-panel overflow-hidden cursor-pointer group"
        style={{
          transition: 'transform 0.1s ease',
          transformStyle: 'preserve-3d',
          boxShadow: hovered
            ? `0 25px 60px rgba(0,0,0,0.6), 0 0 30px ${project.color}22`
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
        onClick={() => onSelect(project)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onSelect(project)}
        aria-label={`View project: ${project.title}`}
      >
        {/* Project preview area */}
        <div
          className="relative h-48 overflow-hidden flex items-center justify-center"
          style={{ background: project.gradient }}
        >
          {/* Animated geometric decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-32 h-32 border"
              style={{ borderColor: project.color }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute w-20 h-20 border"
              style={{ borderColor: project.accentColor }}
            />
          </div>

          {/* Project number */}
          <div
            className="font-display text-7xl font-black opacity-10 select-none"
            style={{ color: project.color }}
          >
            {String(project.id).padStart(2, '0')}
          </div>

          {/* Featured badge */}
          {project.featured && (
            <div
              className="absolute top-3 right-3 font-mono text-xs px-2 py-1"
              style={{
                background: `${project.color}22`,
                border: `1px solid ${project.color}`,
                color: project.color,
              }}
            >
              FEATURED
            </div>
          )}

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center gap-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          >
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="font-mono text-xs px-4 py-2 transition-all hover:scale-105"
              style={{
                background: project.color,
                color: 'var(--cyber-bg)',
              }}
            >
              LIVE DEMO ↗
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="font-mono text-xs px-4 py-2 border transition-all hover:scale-105"
              style={{ borderColor: project.color, color: project.color }}
            >
              GITHUB ↗
            </a>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="font-mono text-xs mb-1" style={{ color: `${project.color}88` }}>
            {project.subtitle}
          </div>
          <h3
            className="font-display text-xl font-bold mb-3 group-hover:transition-colors duration-300"
            style={{ color: hovered ? project.color : 'white' }}
          >
            {project.title}
          </h3>
          <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'rgba(224,242,254,0.55)' }}>
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-xs px-2 py-0.5"
                style={{
                  background: `${project.color}11`,
                  border: `1px solid ${project.color}33`,
                  color: `${project.color}cc`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div
            className="flex items-center gap-4 pt-4 border-t"
            style={{ borderColor: 'rgba(0,212,255,0.08)' }}
          >
            {Object.entries(project.stats).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1">
                <span className="font-mono text-xs" style={{ color: project.color }}>{val}</span>
                <span className="font-mono text-xs" style={{ color: 'rgba(0,212,255,0.3)' }}>{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom glow line on hover */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
            boxShadow: `0 0 8px ${project.color}`,
            transformOrigin: 'left',
          }}
        />
      </div>
    </motion.div>
  )
}

// ─── Modal ────────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="cyber-panel max-w-2xl w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="h-48 relative flex items-center justify-center"
          style={{ background: project.gradient }}
        >
          <div className="font-display text-6xl font-black" style={{ color: `${project.color}22` }}>
            {project.title}
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center font-mono text-sm"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="p-8">
          <h3 className="font-display text-2xl font-bold mb-2" style={{ color: project.color }}>
            {project.title}
          </h3>
          <p className="font-mono text-sm mb-4" style={{ color: 'rgba(0,212,255,0.5)' }}>
            {project.subtitle}
          </p>
          <p className="font-body text-base leading-relaxed mb-6" style={{ color: 'rgba(224,242,254,0.7)' }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(t => (
              <span key={t} className="font-mono text-xs px-3 py-1"
                style={{ background: `${project.color}15`, border: `1px solid ${project.color}40`, color: project.color }}>
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            <a href={project.liveUrl} target="_blank" rel="noreferrer"
              className="flex-1 text-center font-mono text-sm py-3 transition-all hover:scale-105"
              style={{ background: project.color, color: 'var(--cyber-bg)' }}>
              LIVE DEMO ↗
            </a>
            <a href={project.githubUrl} target="_blank" rel="noreferrer"
              className="flex-1 text-center font-mono text-sm py-3 border transition-all hover:scale-105"
              style={{ borderColor: project.color, color: project.color }}>
              SOURCE CODE ↗
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Projects section ─────────────────────────────────────────
export default function Projects() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [selected, setSelected] = useState(null)

  return (
    <section
      id="projects"
      className="relative py-32 cyber-grid"
      style={{ background: 'var(--cyber-surface)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 60%, rgba(255,45,120,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="font-mono text-sm tracking-[0.3em] mb-3" style={{ color: 'var(--cyber-accent)' }}>
            &gt; 03 / PROJECTS.DB
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="font-display text-4xl md:text-5xl font-black text-white">
              SELECTED{' '}
              <span style={{ color: 'var(--cyber-accent)', textShadow: '0 0 20px var(--cyber-accent)' }}>
                WORK
              </span>
            </h2>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs tracking-widest px-5 py-2.5 border transition-all hover:scale-105"
              style={{ borderColor: 'rgba(0,212,255,0.3)', color: 'rgba(0,212,255,0.6)' }}
            >
              ALL REPOS ↗
            </a>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}
