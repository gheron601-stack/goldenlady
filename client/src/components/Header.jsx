import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/jewelry', label: 'Jewelry' },
    { to: '/accessories', label: 'Accessories' },
    { to: '/custom-orders', label: 'Custom Orders' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">
          {/* Brand lockup */}
          <Link to="/" className="brand-block" onClick={() => setMobileOpen(false)}>
            <div className="brand-badge">GL</div>
            <div className="brand-text">
              <span className="brand-name">Golden Lady</span>
              <span className="brand-sub">Fine Jewelry &amp; Accessories</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="main-nav" aria-label="Main navigation">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
                {/* Active dot indicator */}
                <span className="nav-active-dot" aria-hidden="true" />
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="https://wa.me/639954889011"
            target="_blank"
            rel="noopener noreferrer"
            className="header-cta-btn"
            aria-label="Order via WhatsApp"
          >
            Order Now
          </a>

          {/* Mobile burger */}
          <button
            className={`mobile-menu-btn${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile overlay nav */}
      <nav
        className={`mobile-nav-overlay${mobileOpen ? ' open' : ''}`}
        aria-label="Mobile navigation"
      >
        {navLinks.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Contact Us</div>
          <a href="tel:+639954889011" style={{ display: 'block', color: 'var(--ivory-muted)', fontFamily: 'var(--font-sans)', fontSize: 14, marginBottom: 8 }}>
            +63 995 488 9011
          </a>
          <a href="mailto:Goldenladyjewelry8@gmail.com" style={{ display: 'block', color: 'var(--ivory-muted)', fontFamily: 'var(--font-sans)', fontSize: 14 }}>
            Goldenladyjewelry8@gmail.com
          </a>
        </div>
      </nav>
    </>
  )
}
