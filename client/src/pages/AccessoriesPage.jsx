import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { fetchProducts } from '../utils/api'

const SUBS = [
  { key: 'all',        label: 'All Accessories' },
  { key: 'bracelets',  label: 'Bracelets' },
  { key: 'pins',       label: 'Pins' },
  { key: 'other',      label: 'Other' },
]

export default function AccessoriesPage() {
  const { sub } = useParams()
  const navigate = useNavigate()
  const active = sub || 'all'
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = { category: 'accessories' }
    if (active !== 'all') params.subcategory = active
    fetchProducts(params)
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => { setProducts([]); setLoading(false) })
  }, [active])

  const displayItems = products

  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <div className="overline animate-in">Our Collection</div>
          <h1 className="section-title animate-in" style={{ marginBottom: 0 }}>
            Fine <em>Accessories</em>
          </h1>
          <div className="gem-divider animate-in" style={{ maxWidth: 200, margin: '16px auto' }}>
            <div className="gem" />
          </div>
          <p className="section-sub animate-in" style={{ margin: '0 auto' }}>
            Bracelets, pins, and refined accessories that complete every look
            with a touch of Golden Lady elegance.
          </p>
        </div>
      </div>

      <section className="inner-section">
        <div className="container">
          <div className="tabs-row" role="tablist" aria-label="Accessories categories">
            {SUBS.map(s => (
              <button
                key={s.key}
                role="tab"
                aria-selected={active === s.key}
                className={`tab-btn${active === s.key ? ' active' : ''}`}
                onClick={() => navigate(s.key === 'all' ? '/accessories' : `/accessories/${s.key}`)}
              >
                {s.label}
              </button>
            ))}
          </div>

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
              <div className="empty-state-text">New accessories coming soon</div>
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
