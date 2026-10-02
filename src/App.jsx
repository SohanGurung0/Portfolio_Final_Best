import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Loader from './components/Loader'

export default function App() {
  const [loading, setLoading] = useState(true)

  // Check if we are on a 404 route
  const path = window.location.pathname;
  const is404 = path !== '/' && path !== '/index.html';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <Loader key="loader" />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {!is404 && <Navbar />}
            <main>
              <Hero is404={is404} />
              {!is404 && (
                <>
                  <About />
                  <Skills />
                  <Projects />
                  <Contact />
                </>
              )}
            </main>
            {!is404 && <Footer />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
