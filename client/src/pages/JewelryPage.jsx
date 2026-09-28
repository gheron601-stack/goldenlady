import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { fetchProducts, ORDER_FORM_URL } from '../utils/api'

const GemDivider = () => (
  <div className="gem-divider"><div className="gem" /></div>
)

const SUBS = [
  { key: 'all',       label: 'All Jewelry' },
  { key: 'necklaces', label: 'Necklaces' },
  { key: 'rings',     label: 'Rings' },
  { key: 'earrings',  label: 'Earrings' },
  { key: 'pendants',  label: 'Pendants' },
  { key: 'bracelets', label: 'Bracelets' },
]

export default function JewelryPage() {
  const { sub } = useParams()
  const navigate = useNavigate()
  const active = sub || 'all'
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = { category: 'jewelry' }
    if (active !== 'all') params.subcategory = active
    fetchProducts(params)
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => { setProducts([]); setLoading(false) })
  }, [active])

  const displayItems = products

  return (
    <>
      {/* Page hero */}
      <div className="page-hero">
        <div className="container page-hero-content">
          <div className="overline animate-in">Our Collection</div>
          <h1 className="section-title animate-in" style={{ marginBottom: 0 }}>
            Fine <em>Jewelry</em>
          </h1>
          <div className="gem-divider animate-in" style={{ maxWidth: 200, margin: '16px auto' }}>
            <div className="gem" />
          </div>
          <p className="section-sub animate-in" style={{ margin: '0 auto' }}>
            Handcrafted pieces that tell your story. Each item selected for its
            craftsmanship, beauty, and lasting quality.
          </p>
        </div>
      </div>

      {/* Products */}
      <section className="inner-section">
        <div className="container">
          {/* Tabs */}
          <div className="tabs-row" role="tablist" aria-label="Jewelry categories">
            {SUBS.map(s => (
              <button
                key={s.key}
                role="tab"
                aria-selected={active === s.key}
                className={`tab-btn${active === s.key ? ' active' : ''}`}
                onClick={() => navigate(s.key === 'all' ? '/jewelry' : `/jewelry/${s.key}`)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="product-card">
                  <div className="product-image-wrap skeleton" style={{ aspectRatio: '3/4' }} />
                  <div className="product-info">
                    <div className="skeleton" style={{ height: 18, marginBottom: 8, width: '60%' }} />
                    <div className="skeleton" style={{ height: 12, marginBottom: 16, width: '40%' }} />
                    <div className="skeleton" style={{ height: 36 }} />
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
              {displayItems.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
