import { useState } from 'react'
import { getImageUrl } from '../utils/api'
import OrderModal from './OrderModal'

export default function ProductCard({ product, featured = false }) {
  const imageUrl = getImageUrl(product.image)
  const [showOrder, setShowOrder] = useState(false)

  return (
    <>
      <div className="product-card animate-in">
        <div className="product-image-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} loading="lazy" />
          ) : (
            <div className="product-placeholder">
              <svg viewBox="0 0 48 48" fill="none" className="product-placeholder-icon">
                <path d="M24 8L32 18H16L24 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M16 18L20 38H28L32 18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M20 38L24 42L28 38" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          <div className="product-cat-badge">{product.subcategory || product.category}</div>
          <div className="product-price-badge">₱{Number(product.price).toLocaleString()}</div>
          {featured && (
            <div
              className="product-cat-badge"
              style={{ top: 12, left: 'auto', right: 12, background: 'var(--gold)', border: 'none', color: 'var(--bg-primary)' }}
            >
              Featured
            </div>
          )}
          <div className="product-hover-overlay" />
          <button
            className="product-order-cta"
            onClick={e => { e.stopPropagation(); setShowOrder(true) }}
            aria-label={`Order ${product.name}`}
          >
            Order Now
          </button>
        </div>
        <div className="product-info">
          <div className="product-name">{product.name}</div>
          {product.description && (
            <div className="product-desc">{product.description}</div>
          )}
          <div className="product-footer">
            <div className="product-price">₱{Number(product.price).toLocaleString()}</div>
            <button className="product-view-link" onClick={() => setShowOrder(true)}>View Details</button>
          </div>
        </div>
      </div>

      {showOrder && (
        <OrderModal product={product} onClose={() => setShowOrder(false)} />
      )}
    </>
  )
}
