import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import JewelryPage from './pages/JewelryPage'
import AccessoriesPage from './pages/AccessoriesPage'
import CustomOrdersPage from './pages/CustomOrdersPage'
import ContactPage from './pages/ContactPage'

/* ── Scroll progress bar ──────────────────────────────── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="scroll-progress-bar" aria-hidden="true">
      <div className="scroll-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  )
}

/* ── Back-to-top button ────────────────────────────────── */
function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      className={`back-to-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      ◆
    </button>
  )
}

/* ── WhatsApp floating button ──────────────────────────── */
function WhatsAppFloat() {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=639954889011"
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="wa-icon">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.43.638 4.707 1.753 6.678L2 30l7.522-1.724A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.46 11.46 0 01-5.852-1.606l-.42-.25-4.464 1.023.987-4.352-.274-.446A11.5 11.5 0 0116 4.5c6.351 0 11.5 5.149 11.5 11.5S22.351 27.5 16 27.5zm6.29-8.605c-.344-.172-2.036-1.004-2.352-1.119-.316-.115-.546-.172-.776.172-.23.344-.892 1.119-1.093 1.35-.201.23-.402.259-.746.086-.344-.172-1.453-.535-2.768-1.708-1.022-.912-1.712-2.038-1.913-2.382-.201-.344-.021-.53.151-.701.155-.155.344-.402.516-.603.172-.2.23-.344.344-.574.115-.23.058-.43-.029-.602-.086-.172-.776-1.87-1.063-2.56-.28-.672-.565-.581-.776-.592l-.66-.011c-.23 0-.603.086-.919.43s-1.207 1.178-1.207 2.873 1.236 3.333 1.408 3.562c.172.23 2.433 3.714 5.894 5.21.824.356 1.466.568 1.967.728.827.263 1.58.226 2.174.137.663-.099 2.036-.832 2.322-1.635.287-.804.287-1.492.201-1.635-.086-.143-.316-.229-.66-.401z"/>
      </svg>
      <span className="wa-label">Chat with us</span>
    </a>
  )
}

/* ── Gold cursor sparkle ───────────────────────────────── */
function CursorSparkle() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let particles = []
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 1.5 + 0.5
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 1,
          size: Math.random() * 3 + 1,
        })
      }
    }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles = particles.filter(p => p.life > 0)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.03
        p.vy += 0.05
        ctx.save()
        ctx.globalAlpha = p.life
        ctx.fillStyle = '#C9A84C'
        ctx.shadowBlur = 6
        ctx.shadowColor = '#C9A84C'
        const s = p.size * p.life
        ctx.translate(p.x, p.y)
        ctx.rotate(Math.PI / 4)
        ctx.fillRect(-s / 2, -s / 2, s, s)
        ctx.restore()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="cursor-sparkle-canvas"
      aria-hidden="true"
    />
  )
}

/* ── Page wrapper with transition ─────────────────────── */
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"             element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/jewelry"      element={<PageWrapper><JewelryPage /></PageWrapper>} />
        <Route path="/jewelry/:sub" element={<PageWrapper><JewelryPage /></PageWrapper>} />
        <Route path="/accessories"      element={<PageWrapper><AccessoriesPage /></PageWrapper>} />
        <Route path="/accessories/:sub" element={<PageWrapper><AccessoriesPage /></PageWrapper>} />
        <Route path="/custom-orders" element={<PageWrapper><CustomOrdersPage /></PageWrapper>} />
        <Route path="/contact"      element={<PageWrapper><ContactPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

/* ── IntersectionObserver for scroll animations ───────── */
function useScrollAnimations() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const observe = () => document.querySelectorAll('.animate-in:not(.visible)').forEach(el => io.observe(el))
    observe()
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [])
}

export default function App() {
  useScrollAnimations()
  return (
    <BrowserRouter>
      <ScrollProgress />
      <CursorSparkle />
      <Header />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </BrowserRouter>
  )
}
