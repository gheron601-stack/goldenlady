import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../utils/api'
import ProductCard from '../components/ProductCard'

/* ── Gem divider helper ── */
const GemDivider = ({ size = '' }) => (
  <div className={`gem-divider${size ? ' ' + size : ''}`}>
    <div className="gem" />
  </div>
)

/* ── Count-up animation for stats ── */
function CountUp({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect() } },
      { threshold: 0.5 }
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let startTime
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(end)
    }
    requestAnimationFrame(step)
  }, [started, end, duration])

  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

/* ── Parallax hook ── */
function useParallax(speed = 0.3) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed
      const media = el.querySelector('.store-strip-img, video, img')
      if (media) media.style.transform = `translateY(${offset}px) scale(1.03)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])
  return ref
}

/* ── Marquee content (repeated 10×) ── */
const MARQUEE_ITEM = 'Fine Jewelry ◆ Custom Orders ◆ Ring Restoration ◆ Handcrafted ◆ Accessories'


/* ── Service cards ── */
const SERVICES = [
  {
    icon: (
      <svg className="service-icon" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="10"/><path d="M14 10v8M10 14h8"/>
      </svg>
    ),
    title: 'Ring Restoration',
    desc: 'We breathe new life into worn or damaged rings with expert care.',
  },
  {
    icon: (
      <svg className="service-icon" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z"/>
      </svg>
    ),
    title: 'Masonic Rings',
    desc: 'Precision-crafted Masonic rings with meaningful symbols and detail.',
  },
  {
    icon: (
      <svg className="service-icon" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="20" height="14" rx="1"/><path d="M9 10V7a5 5 0 0110 0v3"/>
      </svg>
    ),
    title: 'College Rings',
    desc: 'Celebrate milestones with a custom college ring, built to last a lifetime.',
  },
  {
    icon: (
      <svg className="service-icon" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 22s-8-5-8-11a8 8 0 0116 0c0 6-8 11-8 11z"/>
      </svg>
    ),
    title: 'Wedding Rings',
    desc: 'Beautiful, bespoke wedding rings crafted for your most special day.',
  },
]

/* ── Testimonials ── */
const TESTIMONIALS = [
  {
    id: 't1', initial: 'M', name: 'Maria Santos', location: 'Manila',
    text: '"The necklace I ordered was beyond beautiful — the craftsmanship is extraordinary. I wear it every day and receive compliments constantly."',
  },
  {
    id: 't2', initial: 'J', name: 'Jose Reyes', location: 'Quezon City',
    text: '"Golden Lady made our wedding bands and they are absolutely perfect. Every detail was exactly as we envisioned. Truly special pieces."',
  },
  {
    id: 't3', initial: 'A', name: 'Ana Paras', location: 'Cebu City',
    text: '"I had my grandmother\'s ring restored and it looks brand new — even better than new. The care and attention to detail is unmatched."',
  },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    setLoading(true)
    fetchProducts({ featured: true })
      .then(data => {
        if (data && data.length > 0) {
          setFeatured(data)
        } else {
          fetchProducts().then(all => setFeatured(all ? all.slice(0, 8) : [])).catch(() => setFeatured([]))
        }
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false))
  }, [])

  const tabs = [
    { key: 'all',       label: 'All' },
    { key: 'necklaces', label: 'Necklaces' },
    { key: 'rings',     label: 'Rings' },
    { key: 'pendants',  label: 'Pendants' },
    { key: 'bracelets', label: 'Bracelets' },
  ]

  const displayItems = activeTab === 'all'
    ? featured
    : featured.filter(i =>
        (i.subcategory || '').toLowerCase() === activeTab.toLowerCase() ||
        (i.category || '').toLowerCase() === activeTab.toLowerCase()
      )

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="hero" aria-label="Hero">
        {/* Background video — Ken Burns zoom */}
        <video
          className="hero-video ken-burns"
          src="/goldenladyactual.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Overlay layers */}
        <div className="hero-overlay-grad" aria-hidden="true" />
        <div className="hero-overlay-vignette" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />

        {/* Floating badge */}
        <div className="hero-badge" aria-hidden="true">
          <span className="hero-badge-text">Fine<br />Jewelry</span>
        </div>

        {/* Main content */}
        <div className="hero-content">
          <div className="hero-eyebrow">Est. · Fine Jewelry &amp; Accessories</div>
          <h1 className="hero-title">
            <span className="word-golden">Golden</span>
            <span className="word-lady">Lady</span>
          </h1>
          <GemDivider size="sm" />
          <p className="hero-tagline">
            Curated fine jewelry and timeless accessories for those who appreciate
            the quiet beauty of heirlooms.
          </p>
          <div className="hero-cta">
            <Link to="/jewelry" className="btn-primary">Explore Collection</Link>
            <Link to="/custom-orders" className="btn-ghost">Custom Orders</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" aria-hidden="true">
          <span className="scroll-label">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ══ MARQUEE STRIP ══════════════════════════════════════ */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="marquee-item">{MARQUEE_ITEM}</span>
          ))}
        </div>
      </div>

      {/* ══ STATS BAND ════════════════════════════════════════ */}
      <div className="stats-band">
        <div className="container">
          <div className="stats-grid">
            {[
              { end: 15,  suffix: '+',  label: 'Years in Business' },
              { end: 10,  suffix: 'K+', label: 'Pieces Crafted' },
              { end: 4.9, suffix: '',   prefix: '★ ', label: 'Customer Rating', isFloat: true },
              { end: 100, suffix: '%',  label: 'Handcrafted' },
            ].map(s => (
              <div key={s.label} className="stat-col animate-in">
                <div className="stat-value">
                  {s.isFloat
                    ? <span>{s.prefix}{s.end}</span>
                    : <CountUp end={s.end} suffix={s.suffix} prefix={s.prefix || ''} />}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ JEWELRY COLLECTION ════════════════════════════════ */}
      <section className="collection-section" id="collection">
        <div className="container">
          <div className="section-head animate-in">
            <div className="overline">Our Collection</div>
            <h2 className="section-title">
              Fine <em>Jewelry</em>
            </h2>
            <GemDivider />
            <p className="section-sub">
              Handcrafted pieces that tell your story. Each item is selected for its
              craftsmanship, beauty, and lasting quality.
            </p>
          </div>

          {/* Tabs */}
          <div className="tabs-row" role="tablist" aria-label="Jewelry categories">
            {tabs.map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={activeTab === t.key}
                className={`tab-btn${activeTab === t.key ? ' active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="product-card">
                  <div className="product-image-wrap skeleton" style={{ aspectRatio: '3/4' }} />
                  <div className="product-info">
                    <div className="skeleton" style={{ height: 18, marginBottom: 8, width: '60%' }} />
                    <div className="skeleton" style={{ height: 36, marginTop: 16 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : displayItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">◆</div>
              <div className="empty-state-text">New pieces coming soon</div>
            </div>
          ) : (
            <div className="products-grid">
              {displayItems.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 56 }} className="animate-in">
            <Link to="/jewelry" className="btn-outline">View All Jewelry</Link>
          </div>
        </div>
      </section>

      {/* ══ OUR STORE STRIP ═══════════════════════════════════ */}
      <div className="store-strip">
        <img
          className="store-strip-img"
          src="/wallpaper.jpg"
          alt="Golden Lady store"
        />
        <div className="store-strip-overlay" aria-hidden="true" />
        <div className="store-strip-grain" aria-hidden="true" />
        <div className="store-strip-content animate-in">
          <div>
            <div className="overline">Visit Us In Store</div>
            <h2 className="store-strip-title">
              <span className="line-ivory">Step Into</span><br />
              <span className="line-gold">Our World</span>
            </h2>
            <div className="store-rule" />
            <p className="store-body">
              Come discover our full collection in person. Our warm,
              intimate store is designed to make every visit an experience.
            </p>
            <div className="store-info-rows">
              <div className="store-info-row">
                <span className="store-info-label">Location</span>
                <span className="store-info-value">2nd Floor, Bldg A, SM Megamall, Mandaluyong City</span>
              </div>
              <div className="store-info-row">
                <span className="store-info-label">Hours</span>
                <span className="store-info-value">Mon – Sun, 10:00 AM – 8:00 PM</span>
              </div>
              <div className="store-info-row">
                <span className="store-info-label">Contact</span>
                <span className="store-info-value">+63 995 488 9011</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CUSTOM ORDERS ═════════════════════════════════════ */}
      <section className="custom-section" id="custom">
        <div className="container">
          <div className="custom-grid">
            {/* Left */}
            <div className="animate-in">
              <div className="overline">Bespoke</div>
              <h2 className="custom-left-title">
                <span className="line-ivory">Custom Jewelry,</span><br />
                <span className="line-gold">Made for You</span>
              </h2>
              <div className="custom-rule" />
              <p className="custom-body">
                Every great piece begins with a vision. Whether it is a family heirloom redesigned,
                a Masonic ring, a college milestone, or wedding bands — we bring it to life
                with meticulous attention and gold-standard craftsmanship.
              </p>
              <div className="overline" style={{ marginBottom: 16 }}>What We Create</div>
              <div className="service-cards">
                {SERVICES.map(s => (
                  <div key={s.title} className="service-card">
                    {s.icon}
                    <div className="service-title">{s.title}</div>
                    <div className="service-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image */}
            <div className="custom-image-col animate-in">
              <img
                src="/catalog/Rings__Wedding_ring_1.png"
                alt="Custom jewelry crafting"
              />
              <div className="custom-image-frame" aria-hidden="true" />
              <div className="custom-image-fade" aria-hidden="true" />
              <div className="custom-stat-badge">
                <div className="custom-stat-num">100%</div>
                <div className="custom-stat-label">Handcrafted<br />Every Piece</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════ */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-head animate-in">
            <div className="overline">What Our Customers Say</div>
            <h2 className="section-title">
              Worn with <em>Love</em>
            </h2>
            <GemDivider />
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className="testimonial-card animate-in">
                <div className="testimonial-quote-mark" aria-hidden="true">"</div>
                <div className="testimonial-content">
                  <div className="testimonial-stars">★★★★★</div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar" aria-hidden="true">{t.initial}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-location">{t.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT SECTION ════════════════════════════════════ */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="section-head animate-in">
            <div className="overline dark">We'd Love to Hear From You</div>
            <h2 className="section-title">
              <em>Contact</em> Us
            </h2>
            <GemDivider />
            <p className="section-sub" style={{ color: 'rgba(26,20,16,0.66)' }}>
              Reach out via phone, Viber, or WhatsApp — we're here to help you find the perfect piece.
            </p>
          </div>

          <div className="contact-layout">
            {/* Left — contact cards */}
            <div className="contact-cards-grid animate-in">
              {[
                { icon: '📞', label: 'Phone / Viber / WhatsApp', value: '+63 995 488 9011', href: 'tel:+639954889011' },
                { icon: '✉️', label: 'Email', value: 'Goldenladyjewelry8@gmail.com', href: 'mailto:Goldenladyjewelry8@gmail.com' },
                { icon: '📸', label: 'Instagram', value: '@GoldenLadyJewelry', href: 'https://instagram.com/GoldenLadyJewelry' },
                { icon: '📘', label: 'Facebook', value: 'Golden Lady Jewelry', href: 'https://facebook.com/GoldenLadyJewelry' },
              ].map(c => (
                <a key={c.label} href={c.href} className="contact-card" target="_blank" rel="noopener noreferrer">
                  <div className="contact-card-icon">{c.icon}</div>
                  <div className="contact-card-label">{c.label}</div>
                  <div className="contact-card-value">{c.value}</div>
                </a>
              ))}
            </div>

            {/* Right — process + payment */}
            <div className="animate-in">
              <div className="overline dark">How We Work</div>
              <h3 className="contact-right-title">
                Simple, <em>personal</em> service
              </h3>
              <div className="process-divider">
                <div className="gem" />
              </div>
              <div className="timeline">
                {[
                  'Click Order Now on any product',
                  'Fill in your details and preferences',
                  'We contact you via Viber or Messenger',
                  'Arrange payment securely',
                  'We ship directly to you',
                ].map((step, i, arr) => (
                  <div key={i} className="timeline-step">
                    <div className="timeline-left">
                      <div className="timeline-circle">{i + 1}</div>
                      {i < arr.length - 1 && <div className="timeline-connector" />}
                    </div>
                    <div className="timeline-text">{step}</div>
                  </div>
                ))}
              </div>
              <div className="payment-block">
                <div className="payment-label">Payment Methods</div>
                <div className="payment-methods">GCash • PayMaya • Bank Transfer</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

